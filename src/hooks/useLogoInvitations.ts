
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AccessLevel = 'view' | 'download' | 'edit';

export interface LogoInvitation {
  id: string;
  logo_id: string;
  invited_email: string;
  access_level: AccessLevel;
  invited_by: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  invite_token: string | null;
}

export const useLogoInvitations = (logoId: string) => {
  return useQuery({
    queryKey: ['logo-invitations', logoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('logo_invitations')
        .select('*')
        .eq('logo_id', logoId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LogoInvitation[];
    },
    enabled: !!logoId,
  });
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      logoId,
      email,
      accessLevel,
      expiresAt
    }: {
      logoId: string;
      email: string;
      accessLevel: AccessLevel;
      expiresAt?: string | null;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('logo_invitations')
        .insert({
          logo_id: logoId,
          invited_email: email.toLowerCase().trim(),
          access_level: accessLevel,
          invited_by: user.id,
          expires_at: expiresAt
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as LogoInvitation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['logo-invitations', data.logo_id] });
      queryClient.invalidateQueries({ queryKey: ['logos'] });
      toast.success('Invitation sent successfully');
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error('This user already has access to this logo');
      } else {
        toast.error(`Failed to send invitation: ${error.message}`);
      }
    },
  });
};

export const useUpdateInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      invitationId,
      accessLevel,
      expiresAt
    }: {
      invitationId: string;
      accessLevel?: AccessLevel;
      expiresAt?: string | null;
    }) => {
      const updateData: any = {};
      if (accessLevel) updateData.access_level = accessLevel;
      if (expiresAt !== undefined) updateData.expires_at = expiresAt;

      const { data, error } = await supabase
        .from('logo_invitations')
        .update(updateData)
        .eq('id', invitationId)
        .select()
        .single();
      
      if (error) throw error;
      return data as LogoInvitation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['logo-invitations', data.logo_id] });
      queryClient.invalidateQueries({ queryKey: ['logos'] });
      toast.success('Invitation updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update invitation: ${error.message}`);
    },
  });
};

export const useDeleteInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from('logo_invitations')
        .delete()
        .eq('id', invitationId);
      
      if (error) throw error;
    },
    onSuccess: (_, invitationId) => {
      queryClient.invalidateQueries({ queryKey: ['logo-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['logos'] });
      toast.success('Invitation revoked successfully');
    },
    onError: (error) => {
      toast.error(`Failed to revoke invitation: ${error.message}`);
    },
  });
};
