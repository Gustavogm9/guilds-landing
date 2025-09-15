import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useCallback } from 'react';

export interface BrandColors {
  id: string;
  primary_color: string;
  accent_color: string;
  neutral_scale: Record<string, string>;
  semantic_colors: Record<string, string>;
  system_colors: Record<string, string>;
  gradients: Record<string, string>;
  shadows: Record<string, string>;
  scheme_name: string;
  scheme_description?: string;
  is_active: boolean;
  theme_mode: 'light' | 'dark' | 'auto';
  contrast_checked: boolean;
}

export interface ColorPreset {
  id: string;
  preset_name: string;
  preset_description?: string;
  category: string;
  colors: Record<string, string>;
  usage_count: number;
}

export const useBrandColors = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch active brand colors
  const { data: brandColors, isLoading } = useQuery({
    queryKey: ['brand-colors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_colors')
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data ? {
        ...data,
        neutral_scale: data.neutral_scale as Record<string, string>,
        semantic_colors: data.semantic_colors as Record<string, string>,
        system_colors: data.system_colors as Record<string, string>,
        gradients: data.gradients as Record<string, string>,
        shadows: data.shadows as Record<string, string>
      } as BrandColors : null;
    },
  });

  // Fetch color presets
  const { data: colorPresets } = useQuery({
    queryKey: ['color-presets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('color_presets')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });
      
      if (error) throw error;
      return data as ColorPreset[];
    },
  });

  // Apply colors to CSS variables
  const applyColors = useCallback((colors: BrandColors) => {
    const root = document.documentElement;
    
    // Apply brand colors
    root.style.setProperty('--brand-primary', colors.primary_color.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--brand-accent', colors.accent_color.replace('hsl(', '').replace(')', ''));
    
    // Apply neutral scale
    Object.entries(colors.neutral_scale).forEach(([key, value]) => {
      root.style.setProperty(`--neutral-${key}`, value.replace('hsl(', '').replace(')', ''));
    });
    
    // Apply semantic colors
    Object.entries(colors.semantic_colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value.replace('hsl(', '').replace(')', ''));
    });
    
    // Apply system colors  
    Object.entries(colors.system_colors).forEach(([key, value]) => {
      const cssKey = key.replace(/_/g, '-');
      root.style.setProperty(`--${cssKey}`, value.replace('hsl(', '').replace(')', ''));
    });
    
    // Apply gradients
    Object.entries(colors.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value);
    });
    
    // Apply shadows
    Object.entries(colors.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
  }, []);

  // Apply colors on load and changes
  useEffect(() => {
    if (brandColors) {
      applyColors(brandColors);
    }
  }, [brandColors, applyColors]);

  // Update brand colors mutation
  const updateColorsMutation = useMutation({
    mutationFn: async (colors: Partial<BrandColors>) => {
      const { data, error } = await supabase
        .from('brand_colors')
        .upsert({
          ...colors,
          is_active: true
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['brand-colors'] });
      if (data) {
        const typedData = {
          ...data,
          neutral_scale: data.neutral_scale as Record<string, string>,
          semantic_colors: data.semantic_colors as Record<string, string>,
          system_colors: data.system_colors as Record<string, string>,
          gradients: data.gradients as Record<string, string>,
          shadows: data.shadows as Record<string, string>
        } as BrandColors;
        applyColors(typedData);
      }
      toast({
        title: "Cores atualizadas",
        description: "O esquema de cores foi aplicado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar cores",
        description: "Não foi possível salvar o esquema de cores.",
        variant: "destructive",
      });
    },
  });

  // Apply preset mutation
  const applyPresetMutation = useMutation({
    mutationFn: async (presetId: string) => {
      const preset = colorPresets?.find(p => p.id === presetId);
      if (!preset) throw new Error('Preset not found');

      // Update usage count
      await supabase
        .from('color_presets')
        .update({ usage_count: preset.usage_count + 1 })
        .eq('id', presetId);

      // Apply colors
      const updatedColors: Partial<BrandColors> = {
        primary_color: preset.colors.primary,
        accent_color: preset.colors.accent,
        semantic_colors: {
          success: preset.colors.success,
          warning: preset.colors.warning,
          danger: preset.colors.danger,
        },
        scheme_name: preset.preset_name,
        scheme_description: `Aplicado do preset: ${preset.preset_description}`,
      };

      return updateColorsMutation.mutateAsync(updatedColors);
    },
  });

  // Generate automatic neutral scale from primary
  const generateNeutralScale = useCallback((primaryHsl: string) => {
    // Extract HSL values
    const match = primaryHsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return {};

    const [, h, s] = match;
    const hue = parseInt(h);
    const saturation = Math.max(5, parseInt(s) * 0.2); // Reduced saturation for neutrals

    return {
      "50": `hsl(${hue}, ${saturation}%, 98%)`,
      "100": `hsl(${hue}, ${saturation}%, 96%)`,
      "200": `hsl(${hue}, ${saturation}%, 91%)`,
      "300": `hsl(${hue}, ${saturation}%, 79%)`,
      "400": `hsl(${hue}, ${saturation}%, 46%)`,
      "500": `hsl(${hue}, ${saturation}%, 26%)`,
      "600": `hsl(${hue}, ${Math.min(20, saturation + 5)}%, 17%)`,
      "700": `hsl(${hue}, ${Math.min(25, saturation + 10)}%, 12%)`,
      "800": `hsl(${hue}, ${Math.min(30, saturation + 15)}%, 8%)`,
      "900": `hsl(${hue}, ${Math.min(35, saturation + 20)}%, 5%)`,
    };
  }, []);

  // Generate gradients from primary and accent
  const generateGradients = useCallback((primary: string, accent: string) => {
    return {
      primary: `linear-gradient(135deg, ${primary}, ${primary.replace(/(\d+)%\)/, (_, l) => `${Math.min(90, parseInt(l) + 10)}%)`)})`,
      accent: `linear-gradient(135deg, ${accent}, ${accent.replace(/(\d+)%\)/, (_, l) => `${Math.min(90, parseInt(l) + 10)}%)`)})`,
      hero: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
      subtle: `linear-gradient(180deg, hsl(220, 14%, 96%), hsl(220, 13%, 91%))`,
    };
  }, []);

  // Check contrast ratio for accessibility
  const checkContrast = useCallback((color1: string, color2: string) => {
    // Simplified contrast check - in production use a proper contrast library
    return { ratio: 4.5, passes: true }; // Placeholder
  }, []);

  // Reset to default colors
  const resetToDefault = useCallback(() => {
    const defaultColors: Partial<BrandColors> = {
      primary_color: 'hsl(240, 85%, 55%)',
      accent_color: 'hsl(165, 85%, 45%)',
      scheme_name: 'Padrão Guilds',
      scheme_description: 'Esquema de cores original restaurado',
    };
    
    updateColorsMutation.mutate(defaultColors);
  }, [updateColorsMutation]);

  return {
    // Data
    brandColors,
    colorPresets,
    isLoading,
    
    // Mutations
    updateColors: updateColorsMutation.mutate,
    applyPreset: applyPresetMutation.mutate,
    isUpdating: updateColorsMutation.isPending || applyPresetMutation.isPending,
    
    // Utilities
    applyColors,
    generateNeutralScale,
    generateGradients,
    checkContrast,
    resetToDefault,
    
    // Helpers
    getActiveColors: () => brandColors,
    isColorSystemReady: () => !!brandColors,
  };
};

// Hook for public access to current colors (no mutations)
export const usePublicBrandColors = () => {
  const { data: colors, isLoading } = useQuery({
    queryKey: ['public-brand-colors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_colors')
        .select('primary_color, accent_color, neutral_scale, semantic_colors, gradients, shadows')
        .eq('is_active', true)
        .single();

      if (error) {
        console.warn('Failed to fetch brand colors, using defaults:', error);
        return {
          primary_color: 'hsl(240, 85%, 55%)',
          accent_color: 'hsl(165, 85%, 45%)',
          neutral_scale: {
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
          },
          semantic_colors: {
            "success": "hsl(142, 76%, 36%)",
            "warning": "hsl(38, 92%, 50%)",
            "danger": "hsl(346, 87%, 43%)"
          },
          gradients: {
            "primary": "linear-gradient(135deg, hsl(240, 85%, 55%), hsl(240, 85%, 65%))",
            "hero": "linear-gradient(135deg, hsl(240, 85%, 55%) 0%, hsl(165, 85%, 45%) 100%)"
          },
          shadows: {
            "guild": "0 10px 30px -10px hsl(240, 85%, 55%, 0.3)",
            "glow": "0 0 40px hsl(165, 85%, 45%, 0.4)"
          }
        };
      }
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return { colors, isLoading };
};