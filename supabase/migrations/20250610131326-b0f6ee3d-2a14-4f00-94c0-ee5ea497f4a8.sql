
-- Drop and recreate the generate_share_token function to fix pgcrypto reference
DROP FUNCTION IF EXISTS public.generate_share_token();

CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$;
