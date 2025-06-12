
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Logo } from './useLogos';
import { sanitizeInput, sanitizeFileName } from '@/utils/security';

export const useUpdateLogo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      logoId,
      title,
      colors,
      fonts,
      notes,
      clientName,
      externalLinks,
      file,
      isPublic,
      shareToken
    }: {
      logoId: string;
      title: string;
      colors: any[];
      fonts: any[];
      notes: string;
      clientName: string;
      externalLinks: any[];
      file?: File;
      isPublic?: boolean;
      shareToken?: string | null;
    }) => {
      console.log('Updating logo with ID:', logoId);
      
      // Sanitize inputs
      const sanitizedTitle = sanitizeInput(title) || 'Untitled Logo';
      const sanitizedNotes = sanitizeInput(notes);
      const sanitizedClientName = sanitizeInput(clientName);
      
      let updateData: any = {
        title: sanitizedTitle,
        colors,
        fonts,
        notes: sanitizedNotes || null,
        client_name: sanitizedClientName || null,
        external_links: externalLinks,
      };

      // Add privacy settings if provided
      if (typeof isPublic !== 'undefined') {
        updateData.is_public = isPublic;
        updateData.share_token = shareToken;
      }

      // If a new file is provided, upload it
      if (file) {
        console.log('Uploading new file for logo update');
        
        // Get the current logo to get user_id for file path
        const { data: currentLogo, error: fetchError } = await supabase
          .from('logos')
          .select('user_id, file_path')
          .eq('id', logoId)
          .single();
        
        if (fetchError) {
          console.error('Error fetching current logo:', fetchError);
          throw new Error('Failed to fetch current logo data');
        }
        
        if (!currentLogo) {
          throw new Error('Logo not found');
        }

        // Delete old file if it exists
        if (currentLogo.file_path) {
          const { error: deleteError } = await supabase.storage
            .from('logos')
            .remove([currentLogo.file_path]);
          
          if (deleteError) {
            console.warn('Failed to delete old file:', deleteError);
            // Don't throw here as the old file might not exist
          }
        }

        // Upload new file with sanitized name
        const sanitizedFileName = sanitizeFileName(file.name);
        const fileName = `${currentLogo.user_id}/${Date.now()}-${sanitizedFileName}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('logos')
          .upload(fileName, file);
        
        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload file: ${uploadError.message}`);
        }
        
        updateData.file_path = uploadData.path;
        updateData.file_type = file.type;
        updateData.file_size = file.size;
      }
      
      // Update logo metadata in database
      const { data, error } = await supabase
        .from('logos')
        .update(updateData)
        .eq('id', logoId)
        .select()
        .single();
      
      if (error) {
        console.error('Database update error:', error);
        throw new Error(`Failed to update logo: ${error.message}`);
      }
      
      console.log('Logo updated successfully:', data);
      return data as Logo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logos'] });
      queryClient.invalidateQueries({ queryKey: ['logo'] });
      toast.success('Logo updated successfully!');
      console.log('Logo update completed successfully');
    },
    onError: (error) => {
      console.error('Logo update error:', error);
      toast.error(`Failed to update logo: ${error.message}`);
    },
  });
};
