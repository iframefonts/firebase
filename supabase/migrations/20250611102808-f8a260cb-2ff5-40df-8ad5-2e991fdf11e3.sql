
-- Enable the pgcrypto extension to make gen_random_bytes() available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Recreate the generate_invite_token function (it may have failed before due to missing extension)
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

-- Update existing invitations that don't have invite tokens
UPDATE public.logo_invitations 
SET invite_token = public.generate_invite_token() 
WHERE invite_token IS NULL;
