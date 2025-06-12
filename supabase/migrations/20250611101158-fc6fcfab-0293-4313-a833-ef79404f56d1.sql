
-- Create enum for access levels
CREATE TYPE public.access_level AS ENUM ('view', 'download', 'edit');

-- Create logo invitations table for granular access control
CREATE TABLE public.logo_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_id UUID NOT NULL REFERENCES public.logos(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  access_level access_level NOT NULL DEFAULT 'view',
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(logo_id, invited_email)
);

-- Enable RLS on logo_invitations
ALTER TABLE public.logo_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies for logo_invitations
CREATE POLICY "Users can view invitations for their own logos"
ON public.logo_invitations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.logos 
    WHERE logos.id = logo_invitations.logo_id 
    AND logos.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create invitations for their own logos"
ON public.logo_invitations
FOR INSERT
WITH CHECK (
  invited_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.logos 
    WHERE logos.id = logo_invitations.logo_id 
    AND logos.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update invitations for their own logos"
ON public.logo_invitations
FOR UPDATE
USING (
  invited_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.logos 
    WHERE logos.id = logo_invitations.logo_id 
    AND logos.user_id = auth.uid()
  )
)
WITH CHECK (
  invited_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.logos 
    WHERE logos.id = logo_invitations.logo_id 
    AND logos.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete invitations for their own logos"
ON public.logo_invitations
FOR DELETE
USING (
  invited_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.logos 
    WHERE logos.id = logo_invitations.logo_id 
    AND logos.user_id = auth.uid()
  )
);

-- Policy for invited users to access logos they have permission for
CREATE POLICY "Invited users can view logos they have access to"
ON public.logos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.logo_invitations li
    JOIN auth.users u ON u.email = li.invited_email
    WHERE li.logo_id = logos.id 
    AND u.id = auth.uid()
    AND (li.expires_at IS NULL OR li.expires_at > now())
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_logo_invitations_updated_at
  BEFORE UPDATE ON public.logo_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
