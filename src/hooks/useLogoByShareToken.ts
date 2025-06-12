
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from './useLogos';
import { validateShareToken } from '@/utils/security';

export const useLogoByShareToken = (shareToken: string) => {
  return useQuery({
    queryKey: ['logo-share', shareToken],
    queryFn: async () => {
      // Validate share token format before making the request
      if (!validateShareToken(shareToken)) {
        throw new Error('Invalid share token format');
      }
      
      // Query for logo with matching share token
      // Only return if the logo is public (even if token exists, logo must be public to access)
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .eq('share_token', shareToken)
        .eq('is_public', true) // Only public logos can be accessed via share token
        .single();
      
      if (error) {
        console.error('Logo share token query error:', error);
        throw error;
      }
      
      console.log('Logo found via share token:', data.id);
      return data as Logo;
    },
    enabled: !!shareToken && validateShareToken(shareToken),
  });
};
