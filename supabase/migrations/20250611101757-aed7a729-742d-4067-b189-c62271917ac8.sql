
-- Remove the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Invited users can view logos they have access to" ON public.logos;
