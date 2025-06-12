
-- Enable RLS on all tables that need it
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for downloads table
CREATE POLICY "Users can insert download records for public logos"
ON public.downloads
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.logos 
    WHERE id = logo_id 
    AND is_public = true
  )
);

CREATE POLICY "Users can view download records for their own logos"
ON public.downloads
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.logos 
    WHERE id = logo_id 
    AND user_id = auth.uid()
  )
);

-- RLS Policies for logos table
CREATE POLICY "Users can view their own logos"
ON public.logos
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can view public logos"
ON public.logos
FOR SELECT
USING (is_public = true);

CREATE POLICY "Users can insert their own logos"
ON public.logos
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own logos"
ON public.logos
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own logos"
ON public.logos
FOR DELETE
USING (user_id = auth.uid());

-- RLS Policies for shares table
CREATE POLICY "Users can view shares for their own logos"
ON public.shares
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.logos 
    WHERE id = logo_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create shares for their own logos"
ON public.shares
FOR INSERT
WITH CHECK (
  shared_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.logos 
    WHERE id = logo_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update shares for their own logos"
ON public.shares
FOR UPDATE
USING (
  shared_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.logos 
    WHERE id = logo_id 
    AND user_id = auth.uid()
  )
)
WITH CHECK (
  shared_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.logos 
    WHERE id = logo_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete shares for their own logos"
ON public.shares
FOR DELETE
USING (
  shared_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.logos 
    WHERE id = logo_id 
    AND user_id = auth.uid()
  )
);

-- Policy for public logo access via share tokens
CREATE POLICY "Public access to logos via share token"
ON public.logos
FOR SELECT
USING (
  is_public = true AND 
  share_token IS NOT NULL
);
