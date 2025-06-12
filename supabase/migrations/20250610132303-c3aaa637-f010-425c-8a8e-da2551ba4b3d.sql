
-- Remove all problematic database functions and triggers
DROP TRIGGER IF EXISTS update_logo_share_token_trigger ON public.logos;
DROP FUNCTION IF EXISTS public.update_logo_share_token();
DROP FUNCTION IF EXISTS public.generate_share_token();

-- Create a simple trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_logos_updated_at
  BEFORE UPDATE ON public.logos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
