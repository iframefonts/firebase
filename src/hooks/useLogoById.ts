
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from './useLogos';

export const useLogoById = (logoId: string) => {
  return useQuery({
    queryKey: ['logo', logoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .eq('id', logoId)
        .single();
      
      if (error) throw error;
      return data as Logo;
    },
    enabled: !!logoId,
  });
};
