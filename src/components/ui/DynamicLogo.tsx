import React from 'react';
import { useLogos } from '@/hooks/useLogos';
import { cn } from '@/lib/utils';

interface DynamicLogoProps {
  type?: 'symbol' | 'full' | 'text';
  variant?: 'light' | 'dark' | 'color' | 'transparent';
  name?: string;
  className?: string;
  alt?: string;
  fallback?: React.ReactNode;
  width?: number;
  height?: number;
}

export function DynamicLogo({ 
  type = 'full',
  variant = 'color',
  name,
  className,
  alt = 'Guilds Logo',
  fallback,
  width,
  height,
  ...props 
}: DynamicLogoProps & React.ImgHTMLAttributes<HTMLImageElement>) {
  const { getLogoByType, getLogoByName, loading, error } = useLogos();
  
  const logo = name ? getLogoByName(name) : getLogoByType(type, variant);

  // Show loading state
  if (loading) {
    return (
      <div 
        className={cn(
          "animate-pulse bg-muted rounded", 
          className,
          !width && !height && "w-32 h-8"
        )}
        style={{ width, height }}
      />
    );
  }

  // Show fallback if no logo found or error
  if (error || !logo) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Default fallback - use existing SVG logos as backup
    if (type === 'symbol') {
      return (
        <img 
          src="/src/assets/guilds-logo-shield.svg"
          alt={alt}
          className={className}
          width={width}
          height={height}
          {...props}
        />
      );
    }
    
    return (
      <img 
        src="/src/assets/guilds-logo-full.svg"
        alt={alt}
        className={className}
        width={width}
        height={height}
        {...props}
      />
    );
  }

  return (
    <img
      src={logo.public_url}
      alt={alt}
      className={className}
      width={width || logo.width}
      height={height || logo.height}
      {...props}
    />
  );
}