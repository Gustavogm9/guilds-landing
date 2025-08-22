import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricBadgeProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  suffix?: string;
  variant?: 'default' | 'primary' | 'accent' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MetricBadge({ 
  icon: Icon, 
  value, 
  label, 
  suffix = '',
  variant = 'default',
  size = 'md',
  className = "" 
}: MetricBadgeProps) {
  // Safety check for icon
  if (!Icon) {
    console.warn('MetricBadge: No icon provided');
    return null;
  }
  const sizeClasses = {
    sm: {
      container: 'p-4',
      icon: 'h-8 w-8',
      value: 'text-2xl',
      label: 'text-sm'
    },
    md: {
      container: 'p-6',
      icon: 'h-10 w-10',
      value: 'text-3xl md:text-4xl',
      label: 'text-base'
    },
    lg: {
      container: 'p-8',
      icon: 'h-12 w-12',
      value: 'text-4xl md:text-5xl',
      label: 'text-lg'
    }
  };

  const variantClasses = {
    default: {
      container: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
      icon: 'text-neutral-600 dark:text-neutral-400',
      value: 'text-foreground',
      label: 'text-muted-foreground'
    },
    primary: {
      container: 'bg-brand-primary/10 border border-brand-primary/20',
      icon: 'text-brand-primary',
      value: 'text-brand-primary',
      label: 'text-brand-primary/80'
    },
    accent: {
      container: 'bg-brand-accent/10 border border-brand-accent/20',
      icon: 'text-brand-accent',
      value: 'text-brand-accent',
      label: 'text-brand-accent/80'
    },
    success: {
      container: 'bg-success/10 border border-success/20',
      icon: 'text-success',
      value: 'text-success',
      label: 'text-success/80'
    }
  };

  const sizeConfig = sizeClasses[size];
  const variantConfig = variantClasses[variant];

  return (
    <div className={`
      rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 text-center
      ${sizeConfig.container}
      ${variantConfig.container}
      ${className}
    `}>
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className={`p-3 rounded-xl ${variant === 'default' ? 'bg-neutral-100 dark:bg-neutral-700' : `bg-current/10`}`}>
          <Icon className={`${sizeConfig.icon} ${variantConfig.icon}`} />
        </div>
      </div>
      
      {/* Value */}
      <div className={`font-sora font-bold ${sizeConfig.value} ${variantConfig.value} mb-2`}>
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        {suffix && <span className="text-current/70">{suffix}</span>}
      </div>
      
      {/* Label */}
      <div className={`font-medium ${sizeConfig.label} ${variantConfig.label}`}>
        {label}
      </div>
    </div>
  );
}