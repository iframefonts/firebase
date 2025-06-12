
-- Add RLS policy to allow public access to branding information for shared logos
-- This allows the LogoShare component to fetch profile branding data without authentication
CREATE POLICY "Public access to branding information for shared logos"
ON public.profiles
FOR SELECT
USING (
  branding_enabled = true AND 
  branding_background_url IS NOT NULL
);

-- Alternative more restrictive policy that only allows access when there's an active share
-- Uncomment this and comment the above if you want stricter access control
-- CREATE POLICY "Public access to branding information via active shares"
-- ON public.profiles
-- FOR SELECT
-- USING (
--   branding_enabled = true AND 
--   branding_background_url IS NOT NULL AND
--   EXISTS (
--     SELECT 1 FROM public.logos l
--     JOIN public.shares s ON l.id = s.logo_id
--     WHERE l.user_id = profiles.id 
--     AND l.is_public = true 
--     AND s.is_active = true
--   )
-- );
