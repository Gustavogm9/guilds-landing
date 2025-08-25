-- Create storage bucket for assets (logos, images, etc)
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Create logos table to store logo metadata
CREATE TABLE public.logos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('symbol', 'full', 'text')),
  variant TEXT NOT NULL CHECK (variant IN ('light', 'dark', 'color', 'transparent')),
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  usage_context TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.logos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to logos
CREATE POLICY "Logos are publicly readable" 
ON public.logos 
FOR SELECT 
USING (true);

-- Create policy for storage access to assets bucket
CREATE POLICY "Assets are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'assets');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_logos_updated_at
BEFORE UPDATE ON public.logos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();