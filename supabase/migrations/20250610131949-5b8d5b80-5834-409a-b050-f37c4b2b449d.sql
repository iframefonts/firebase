
-- Drop the trigger first, then the function, then recreate both
DROP TRIGGER IF EXISTS update_logo_share_token_trigger ON public.logos;
DROP FUNCTION IF EXISTS public.update_logo_share_token();

-- Recreate the function with proper search path
CREATE OR REPLACE FUNCTION public.update_logo_share_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.is_public = true AND (OLD.share_token IS NULL OR OLD.is_public = false) THEN
    NEW.share_token = public.generate_share_token();
  ELSIF NEW.is_public = false THEN
    NEW.share_token = NULL;
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_logo_share_token_trigger
  BEFORE UPDATE ON public.logos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_logo_share_token();
