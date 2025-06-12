
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DesignerProfile {
  full_name: string | null;
  email: string;
  branding_background_url: string | null;
  branding_enabled: boolean | null;
  branding_overlay_opacity: number | null;
}

export const useDesignerProfile = (userId: string | undefined, isLoading: boolean) => {
  const [designerProfile, setDesignerProfile] = useState<DesignerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileRetryCount, setProfileRetryCount] = useState(0);

  useEffect(() => {
    const fetchDesignerProfile = async (retryCount = 0) => {
      if (!userId) {
        console.log('LogoShare: No user_id in logo, skipping profile fetch');
        return;
      }
      
      console.log(`LogoShare: Fetching designer profile for user_id: ${userId} (attempt ${retryCount + 1})`);
      setProfileLoading(true);
      setProfileError(null);
      
      try {
        // Add a small delay on retries to handle potential race conditions
        if (retryCount > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }

        console.log('LogoShare: Making Supabase query to profiles table...');
        const { data, error, status, statusText } = await supabase
          .from('profiles')
          .select('full_name, email, branding_background_url, branding_enabled, branding_overlay_opacity')
          .eq('id', userId)
          .maybeSingle();
        
        console.log('LogoShare: Supabase response:', {
          data,
          error,
          status,
          statusText,
          user_id: userId
        });

        if (error) {
          console.error('LogoShare: Supabase error fetching designer profile:', error);
          
          // Retry logic for network or temporary errors
          if (retryCount < 3 && (error.message.includes('network') || error.message.includes('timeout'))) {
            console.log(`LogoShare: Retrying profile fetch (attempt ${retryCount + 2})`);
            setProfileRetryCount(retryCount + 1);
            setTimeout(() => fetchDesignerProfile(retryCount + 1), 2000);
            return;
          }
          
          setProfileError(`Failed to load designer profile: ${error.message}`);
          setDesignerProfile(null);
        } else {
          console.log('LogoShare: Designer profile fetched successfully:', {
            branding_enabled: data?.branding_enabled,
            branding_background_url: data?.branding_background_url,
            branding_overlay_opacity: data?.branding_overlay_opacity,
            full_name: data?.full_name,
            has_data: !!data,
            data_keys: data ? Object.keys(data) : 'no data'
          });
          
          if (data) {
            setDesignerProfile(data);
            console.log('LogoShare: Profile state updated with:', data);
          } else {
            console.warn('LogoShare: No profile data found for user_id:', userId);
            setDesignerProfile(null);
          }
        }
      } catch (error) {
        console.error('LogoShare: Exception fetching designer profile:', error);
        
        // Retry on network exceptions
        if (retryCount < 3) {
          console.log(`LogoShare: Retrying profile fetch after exception (attempt ${retryCount + 2})`);
          setProfileRetryCount(retryCount + 1);
          setTimeout(() => fetchDesignerProfile(retryCount + 1), 2000);
          return;
        }
        
        setProfileError(`Failed to load designer profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setDesignerProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    // Only fetch profile after logo is loaded and we have a user_id
    if (userId && !isLoading) {
      fetchDesignerProfile();
    }
  }, [userId, isLoading]);

  return {
    designerProfile,
    profileLoading,
    profileError,
    profileRetryCount
  };
};
