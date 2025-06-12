
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from './useLogos';

export const useLogoByInviteToken = (inviteToken: string) => {
  return useQuery({
    queryKey: ['logo-invite', inviteToken],
    queryFn: async () => {
      if (!inviteToken) {
        throw new Error('No invite token provided');
      }

      // First, get the invitation by token to verify access
      const { data: invitation, error: inviteError } = await supabase
        .from('logo_invitations')
        .select('*')
        .eq('invite_token', inviteToken)
        .or('expires_at.is.null,expires_at.gt.now()')
        .single();

      if (inviteError || !invitation) {
        throw new Error('Invalid or expired invite token');
      }

      // Then get the logo data
      const { data: logo, error: logoError } = await supabase
        .from('logos')
        .select('*')
        .eq('id', invitation.logo_id)
        .single();

      if (logoError || !logo) {
        throw new Error('Logo not found');
      }

      // Transform the logo data to match our interface
      return {
        ...logo,
        colors: Array.isArray(logo.colors) ? logo.colors : [],
        fonts: Array.isArray(logo.fonts) ? logo.fonts : [],
        external_links: Array.isArray(logo.external_links) ? logo.external_links : [],
        invitation_access_level: invitation.access_level,
        invitation_expires_at: invitation.expires_at
      } as Logo & {
        invitation_access_level: string;
        invitation_expires_at: string | null;
      };
    },
    enabled: !!inviteToken,
    retry: false,
  });
};
