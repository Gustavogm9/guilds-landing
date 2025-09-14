-- Create brand_colors table for dynamic color management
CREATE TABLE public.brand_colors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Primary brand colors
  primary_color TEXT NOT NULL DEFAULT 'hsl(240, 85%, 55%)',
  accent_color TEXT NOT NULL DEFAULT 'hsl(165, 85%, 45%)',
  
  -- Neutral scale (9 tones)
  neutral_scale JSONB NOT NULL DEFAULT '{
    "50": "hsl(220, 20%, 98%)",
    "100": "hsl(220, 14%, 96%)",
    "200": "hsl(220, 13%, 91%)",
    "300": "hsl(220, 9%, 79%)",
    "400": "hsl(220, 9%, 46%)",
    "500": "hsl(220, 9%, 26%)",
    "600": "hsl(220, 12%, 17%)",
    "700": "hsl(220, 16%, 12%)",
    "800": "hsl(220, 18%, 8%)",
    "900": "hsl(220, 23%, 5%)"
  }'::jsonb,
  
  -- Semantic colors
  semantic_colors JSONB NOT NULL DEFAULT '{
    "success": "hsl(142, 76%, 36%)",
    "warning": "hsl(38, 92%, 50%)",
    "danger": "hsl(346, 87%, 43%)"
  }'::jsonb,
  
  -- System colors (derived from neutral and brand)
  system_colors JSONB NOT NULL DEFAULT '{
    "background": "hsl(0, 0%, 100%)",
    "foreground": "hsl(220, 9%, 26%)",
    "border": "hsl(220, 13%, 91%)",
    "input": "hsl(220, 13%, 91%)",
    "ring": "hsl(240, 85%, 55%)",
    "muted": "hsl(220, 14%, 96%)",
    "muted_foreground": "hsl(220, 9%, 46%)",
    "popover": "hsl(0, 0%, 100%)",
    "popover_foreground": "hsl(220, 9%, 26%)",
    "card": "hsl(0, 0%, 100%)",
    "card_foreground": "hsl(220, 9%, 26%)",
    "secondary": "hsl(220, 14%, 96%)",
    "secondary_foreground": "hsl(220, 9%, 26%)",
    "destructive": "hsl(346, 87%, 43%)",
    "destructive_foreground": "hsl(0, 0%, 100%)"
  }'::jsonb,
  
  -- Gradients
  gradients JSONB NOT NULL DEFAULT '{
    "primary": "linear-gradient(135deg, hsl(240, 85%, 55%), hsl(240, 85%, 65%))",
    "accent": "linear-gradient(135deg, hsl(165, 85%, 45%), hsl(165, 85%, 55%))",
    "hero": "linear-gradient(135deg, hsl(240, 85%, 55%) 0%, hsl(165, 85%, 45%) 100%)",
    "subtle": "linear-gradient(180deg, hsl(220, 14%, 96%), hsl(220, 13%, 91%))"
  }'::jsonb,
  
  -- Shadows
  shadows JSONB NOT NULL DEFAULT '{
    "guild": "0 10px 30px -10px hsl(240, 85%, 55%, 0.3)",
    "glow": "0 0 40px hsl(165, 85%, 45%, 0.4)",
    "forge": "0 0 50px hsl(240, 85%, 55%, 0.2)"
  }'::jsonb,
  
  -- Color scheme metadata
  scheme_name TEXT NOT NULL DEFAULT 'Padrão Guilds',
  scheme_description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_system_preset BOOLEAN NOT NULL DEFAULT false,
  
  -- Theme support
  theme_mode TEXT NOT NULL DEFAULT 'light' CHECK (theme_mode IN ('light', 'dark', 'auto')),
  
  -- Accessibility
  contrast_checked BOOLEAN NOT NULL DEFAULT false,
  accessibility_notes TEXT
);

-- Enable RLS
ALTER TABLE public.brand_colors ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Brand colors are publicly readable" 
ON public.brand_colors 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can manage brand colors" 
ON public.brand_colors 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create function to update updated_at
CREATE TRIGGER update_brand_colors_updated_at
BEFORE UPDATE ON public.brand_colors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default Guilds color scheme
INSERT INTO public.brand_colors (
  scheme_name,
  scheme_description,
  is_system_preset,
  primary_color,
  accent_color
) VALUES (
  'Guilds Original',
  'Esquema de cores original da Guilds - Medieval Tech',
  true,
  'hsl(240, 85%, 55%)',
  'hsl(165, 85%, 45%)'
);

-- Create color presets table for predefined schemes
CREATE TABLE public.color_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  preset_name TEXT NOT NULL,
  preset_description TEXT,
  category TEXT NOT NULL DEFAULT 'custom',
  
  colors JSONB NOT NULL,
  
  is_active BOOLEAN NOT NULL DEFAULT true,
  usage_count INTEGER NOT NULL DEFAULT 0,
  
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS for presets
ALTER TABLE public.color_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Color presets are publicly readable" 
ON public.color_presets 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can manage color presets" 
ON public.color_presets 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Insert system presets
INSERT INTO public.color_presets (preset_name, preset_description, category, colors) VALUES 
('Corporate Blue', 'Esquema corporativo azul profissional', 'business', '{
  "primary": "hsl(217, 91%, 60%)",
  "accent": "hsl(213, 94%, 68%)",
  "success": "hsl(142, 76%, 36%)",
  "warning": "hsl(38, 92%, 50%)",
  "danger": "hsl(346, 87%, 43%)"
}'),
('Creative Orange', 'Esquema criativo laranja vibrante', 'creative', '{
  "primary": "hsl(25, 95%, 53%)",
  "accent": "hsl(45, 93%, 47%)",
  "success": "hsl(142, 76%, 36%)",
  "warning": "hsl(38, 92%, 50%)",
  "danger": "hsl(346, 87%, 43%)"
}'),
('Tech Green', 'Esquema tecnológico verde', 'tech', '{
  "primary": "hsl(142, 76%, 36%)",
  "accent": "hsl(165, 85%, 45%)",
  "success": "hsl(142, 76%, 36%)",
  "warning": "hsl(38, 92%, 50%)",
  "danger": "hsl(346, 87%, 43%)"
}'),
('Elegant Purple', 'Esquema elegante roxo', 'elegant', '{
  "primary": "hsl(262, 83%, 58%)",
  "accent": "hsl(270, 95%, 75%)",
  "success": "hsl(142, 76%, 36%)",
  "warning": "hsl(38, 92%, 50%)",
  "danger": "hsl(346, 87%, 43%)"
}');