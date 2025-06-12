
-- Drop and recreate the generate_share_token function with explicit schema references
DROP FUNCTION IF EXISTS public.generate_share_token();

-- Create the function with explicit references to avoid search path issues
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $$
BEGIN
  -- Explicitly reference gen_random_bytes from the public schema where pgcrypto installs it
  RETURN encode(public.gen_random_bytes(32), 'base64');
END;
$$;

-- Ensure the function has proper dependencies
COMMENT ON FUNCTION public.generate_share_token() IS 'Generates a secure random token for sharing logos. Requires pgcrypto extension.';
