-- Allow public insert, update, and delete operations on logos table
CREATE POLICY "Anyone can insert logos"
ON public.logos
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update logos"
ON public.logos
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete logos"
ON public.logos
FOR DELETE
USING (true);

-- Create storage policies for the assets bucket
CREATE POLICY "Anyone can view assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'assets');

CREATE POLICY "Anyone can upload to assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'assets');

CREATE POLICY "Anyone can update assets"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'assets')
WITH CHECK (bucket_id = 'assets');

CREATE POLICY "Anyone can delete assets"
ON storage.objects
FOR DELETE
USING (bucket_id = 'assets');