
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useClientNames = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['client-names', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('logos')
        .select('client_name')
        .eq('user_id', user.id)
        .not('client_name', 'is', null)
        .neq('client_name', '')
        .order('client_name');
      
      if (error) throw error;
      
      // Get unique client names
      const uniqueClientNames = [...new Set(data.map(item => item.client_name))];
      return uniqueClientNames.filter(Boolean);
    },
    enabled: !!user,
  });
};
