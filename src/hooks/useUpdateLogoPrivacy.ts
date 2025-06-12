import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Generate a secure random token using Web Crypto API
const generateShareToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .substring(0, 43); // Ensure consistent length
};

export const useUpdateLogoPrivacy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ logoId, isPublic }: { logoId: string; isPublic: boolean }) => {
      console.log(`Updating logo ${logoId} privacy to ${isPublic ? 'public' : 'private'}`);
      
      // Validate logoId format (should be UUID)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(logoId)) {
        throw new Error('Invalid logo ID format');
      }
      
      // First, get the current logo to check if it already has a share token
      const { data: currentLogo, error: fetchError } = await supabase
        .from('logos')
        .select('share_token')
        .eq('id', logoId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching current logo:', fetchError);
        throw fetchError;
      }
      
      // Prepare update data
      const updateData: { is_public: boolean; share_token?: string } = {
        is_public: isPublic
      };
      
      // Only generate a new share token if making public AND no token exists
      if (isPublic && !currentLogo.share_token) {
        updateData.share_token = generateShareToken();
        console.log('Generated new share token for public logo (no existing token)');
      }
      // If making private, keep the existing share token (don't delete it)
      // If making public and token exists, keep the existing token
      // This ensures the share URL never changes once created
      
      const { data, error } = await supabase
        .from('logos')
        .update(updateData)
        .eq('id', logoId)
        .select()
        .single();
      
      if (error) {
        console.error('Logo privacy update error:', error);
        throw error;
      }
      
      console.log('Logo privacy updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['logo', data.id] });
      queryClient.invalidateQueries({ queryKey: ['logos'] });
      toast.success(data.is_public ? 'Logo is now public' : 'Logo is now private');
    },
    onError: (error) => {
      toast.error('Failed to update logo privacy');
      console.error('Logo privacy update error:', error);
    },
  });
};
