
-- Add branding fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN branding_background_url TEXT,
ADD COLUMN branding_enabled BOOLEAN DEFAULT false,
ADD COLUMN branding_overlay_opacity NUMERIC(3,2) DEFAULT 0.6;

-- Create storage bucket for branding backgrounds
INSERT INTO storage.buckets (id, name, public)
VALUES ('branding-backgrounds', 'branding-backgrounds', true);

-- Create RLS policies for branding backgrounds bucket
CREATE POLICY "Users can upload their own branding backgrounds" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'branding-backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view branding backgrounds" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'branding-backgrounds');

CREATE POLICY "Users can update their own branding backgrounds" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'branding-backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own branding backgrounds" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'branding-backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);
