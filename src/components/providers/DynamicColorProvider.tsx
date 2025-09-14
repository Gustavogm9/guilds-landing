import React, { useEffect } from 'react';
import { usePublicBrandColors } from '@/hooks/useBrandColors';

interface DynamicColorProviderProps {
  children: React.ReactNode;
}

export const DynamicColorProvider: React.FC<DynamicColorProviderProps> = ({ children }) => {
  const { colors } = usePublicBrandColors();

  useEffect(() => {
    if (colors) {
      const root = document.documentElement;
      
      // Apply brand colors
      root.style.setProperty('--brand-primary', colors.primary_color.replace('hsl(', '').replace(')', ''));
      root.style.setProperty('--brand-accent', colors.accent_color.replace('hsl(', '').replace(')', ''));
      
      // Apply other colors if available
      if (colors.neutral_scale) {
        Object.entries(colors.neutral_scale as Record<string, string>).forEach(([key, value]) => {
          root.style.setProperty(`--neutral-${key}`, value.replace('hsl(', '').replace(')', ''));
        });
      }
      
      if (colors.semantic_colors) {
        Object.entries(colors.semantic_colors as Record<string, string>).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value.replace('hsl(', '').replace(')', ''));
        });
      }
      
      if (colors.gradients) {
        Object.entries(colors.gradients as Record<string, string>).forEach(([key, value]) => {
          root.style.setProperty(`--gradient-${key}`, value);
        });
      }
      
      if (colors.shadows) {
        Object.entries(colors.shadows as Record<string, string>).forEach(([key, value]) => {
          root.style.setProperty(`--shadow-${key}`, value);
        });
      }
    }
  }, [colors]);

  return <>{children}</>;
};