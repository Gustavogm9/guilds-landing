-- Create dashboard_layouts table for storing widget configurations
CREATE TABLE public.dashboard_layouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  widgets_config JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dashboard_layouts ENABLE ROW LEVEL SECURITY;

-- Create policies for dashboard layouts
CREATE POLICY "Users can view their own dashboard layouts"
ON public.dashboard_layouts
FOR SELECT
USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own dashboard layouts"
ON public.dashboard_layouts
FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own dashboard layouts"
ON public.dashboard_layouts
FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own dashboard layouts"
ON public.dashboard_layouts
FOR DELETE
USING (auth.uid() = created_by);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dashboard_layouts_updated_at
BEFORE UPDATE ON public.dashboard_layouts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();