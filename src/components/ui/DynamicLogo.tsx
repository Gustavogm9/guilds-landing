import React, { useEffect, useState } from 'react';
import { useLogos } from '@/hooks/useLogos';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import fallbackShield from '@/assets/guilds-logo-shield.svg';

const log = logger.scope('DynamicLogo');
import fallbackFull from '@/assets/guilds-logo-full.svg';

interface DynamicLogoProps {
  type?: 'symbol' | 'full' | 'text';
  variant?: 'light' | 'dark' | 'color' | 'transparent';
  name?: string;
  usageContext?: string;
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
  usageContext,
  className,
  alt = 'Guilds Logo',
  fallback,
  width,
  height,
  ...props
}: DynamicLogoProps & React.ImgHTMLAttributes<HTMLImageElement>) {
  const { getLogoByType, getLogoByName, getLogoByContext, loading, error } = useLogos();

  const logo = name
    ? getLogoByName(name)
    : usageContext
      ? getLogoByContext(usageContext, type, variant)
      : getLogoByType(type, variant);

  // Add debug logging for DynamicLogo
  if (usageContext) {
    log.debug('Logo search', {
      action: 'search',
      metadata: { usageContext, type, variant, logoFound: !!logo }
    });
  }

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

    // Default fallback - use imported SVG logos as backup
    if (type === 'symbol') {
      return (
        <img
          src={fallbackShield}
          alt={alt}
          width={width || 32}
          height={height || 32}
          className={cn("object-contain", className)}
          style={{ width: width ? `${width}px` : 'auto', height: height ? `${height}px` : 'auto' }}
          {...props}
        />
      );
    }

    return (
      <img
        src={fallbackFull}
        alt={alt}
        className={className}
        width={width || 120}
        height={height || 32}
        style={{ width: width ? `${width}px` : 'auto', height: height ? `${height}px` : '32px' }}
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
      style={{
        width: width ? `${width} px` : 'auto',
        height: height ? `${height} px` : (logo.height ? `${logo.height} px` : '32px')
      }}
      {...props}
    />
  );
}