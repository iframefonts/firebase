
-- Add invite_token to logo_invitations table for shareable access
ALTER TABLE public.logo_invitations 
ADD COLUMN invite_token TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX idx_logo_invitations_invite_token ON public.logo_invitations(invite_token);

-- Function to generate invite tokens
CREATE OR REPLACE FUNCTION public.generate_invite_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'base64url');
END;
$$;

-- Trigger to auto-generate invite tokens for new invitations
CREATE OR REPLACE FUNCTION public.set_invite_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.invite_token IS NULL THEN
    NEW.invite_token = public.generate_invite_token();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_invite_token_trigger
  BEFORE INSERT ON public.logo_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_invite_token();

-- RLS policy to allow access via invite token
CREATE POLICY "Allow access via invite token"
ON public.logo_invitations
FOR SELECT
USING (
  invite_token IS NOT NULL 
  AND (expires_at IS NULL OR expires_at > now())
);
