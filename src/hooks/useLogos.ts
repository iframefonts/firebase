
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Logo {
  id: string;
  title: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  colors: any[];
  fonts: any[];
  notes: string | null;
  client_name: string | null;
  external_links: any[];
  user_id: string;
  created_at: string;
  updated_at: string | null;
  download_count: number | null;
  is_public: boolean | null;
  share_token: string | null;
}

// Transform raw database data to Logo interface
const transformLogo = (rawLogo: any): Logo => ({
  ...rawLogo,
  colors: Array.isArray(rawLogo.colors) ? rawLogo.colors : [],
  fonts: Array.isArray(rawLogo.fonts) ? rawLogo.fonts : [],
  external_links: Array.isArray(rawLogo.external_links) ? rawLogo.external_links : [],
});

export const useLogos = () => {
  return useQuery({
    queryKey: ['logos'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch logos owned by the user
      const { data: ownedLogos, error: ownedError } = await supabase
        .from('logos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ownedError) throw ownedError;

      // Fetch logos the user has been invited to access
      const { data: invitations, error: invitationsError } = await supabase
        .from('logo_invitations')
        .select(`
          logo_id,
          access_level,
          expires_at,
          logos:logo_id (*)
        `)
        .eq('invited_email', user.email)
        .or('expires_at.is.null,expires_at.gt.now()');

      if (invitationsError) throw invitationsError;

      // Extract invited logos and add access level metadata
      const invitedLogos = (invitations || [])
        .filter(inv => inv.logos) // Ensure logos data exists
        .map(inv => ({
          ...(inv.logos as any),
          invited_access_level: inv.access_level,
          invitation_expires_at: inv.expires_at
        }));

      // Combine owned and invited logos, avoiding duplicates
      const allLogos = [...(ownedLogos || [])];
      
      // Add invited logos that aren't already owned
      invitedLogos.forEach(invitedLogo => {
        if (!allLogos.find(logo => logo.id === invitedLogo.id)) {
          allLogos.push(invitedLogo);
        }
      });

      // Transform all logos to match the Logo interface
      return allLogos.map(transformLogo);
    },
  });
};

export const useSaveLogo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      file,
      title,
      colors,
      fonts,
      notes,
      clientName,
      externalLinks,
      isPublic,
      shareToken
    }: {
      file: File;
      title: string;
      colors: any[];
      fonts: any[];
      notes: string;
      clientName: string;
      externalLinks: any[];
      isPublic: boolean;
      shareToken: string | null;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save logo metadata to database
      const { data, error } = await supabase
        .from('logos')
        .insert({
          user_id: user.id,
          title,
          file_path: fileName,
          file_type: file.type,
          file_size: file.size,
          colors,
          fonts,
          notes,
          client_name: clientName,
          external_links: externalLinks,
          is_public: isPublic,
          share_token: shareToken
        })
        .select()
        .single();

      if (error) throw error;
      return transformLogo(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logos'] });
      toast.success('Logo saved successfully!');
    },
    onError: (error) => {
      toast.error('Failed to save logo. Please try again.');
      console.error('Save logo error:', error);
    },
  });
};

export const useDeleteLogo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (logo: Logo) => {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('logos')
        .remove([logo.file_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue with database deletion even if storage fails
      }

      // Delete logo from database
      const { error: dbError } = await supabase
        .from('logos')
        .delete()
        .eq('id', logo.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logos'] });
      toast.success('Logo deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete logo. Please try again.');
      console.error('Delete logo error:', error);
    },
  });
};
