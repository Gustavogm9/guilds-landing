import React, { memo, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// PHASE 3: React.memo() optimized components for heavy sections

// Optimized Service Card with memo
export interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  href: string;
  icon: React.ReactNode;
  index: number;
}

export const ServiceCard = memo(({ 
  title, 
  description, 
  features, 
  href, 
  icon, 
  index 
}: ServiceCardProps) => {
  // Memoize feature badges to prevent re-renders
  const featureBadges = useMemo(() => 
    features.map((feature, idx) => (
      <Badge key={`${feature}-${idx}`} variant="outline" className="text-xs">
        {feature}
      </Badge>
    )),
    [features]
  );

  return (
    <Card className="group bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover-scale">
      <div className="mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {featureBadges}
        </div>
      </div>
      <div className="flex items-center text-primary group-hover:translate-x-2 transition-transform">
        <span className="text-sm font-medium">Saiba mais</span>
        <ArrowRight className="ml-2 h-4 w-4" />
      </div>
    </Card>
  );
});

ServiceCard.displayName = 'ServiceCard';

// Optimized Pillar Card with memo
export interface PillarCardProps {
  title: string;
  description: string;
  metric: string;
  icon: React.ReactNode;
  index: number;
}

export const PillarCard = memo(({ title, description, metric, icon, index }: PillarCardProps) => {
  return (
    <div className="group relative">
      {/* Card Container */}
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 h-full hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover-scale relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Content */}
        <div className="relative space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>

          {/* Title & Metric */}
          <div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="text-sm font-semibold text-accent mb-3">
              {metric}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Decorative Element */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
      </div>
    </div>
  );
});

PillarCard.displayName = 'PillarCard';

// Optimized Step Card with memo
export interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

export const StepCard = memo(({ number, title, description, icon, index }: StepCardProps) => {
  // Color progression through the steps
  const stepColors = useMemo(() => [
    'from-blue-500/20 to-blue-600/10 border-blue-200/50',
    'from-purple-500/20 to-purple-600/10 border-purple-200/50',
    'from-green-500/20 to-green-600/10 border-green-200/50',
    'from-orange-500/20 to-orange-600/10 border-orange-200/50',
    'from-red-500/20 to-red-600/10 border-red-200/50',
    'from-cyan-500/20 to-cyan-600/10 border-cyan-200/50'
  ], []);

  return (
    <div 
      className="text-center space-y-6 relative group animate-fade-in" 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Step Number Badge */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
          {number}
        </div>
      </div>
      
      {/* Icon Container with enhanced styling */}
      <div className="relative">
        <div className={`w-20 h-20 bg-gradient-to-br ${stepColors[index]} rounded-3xl flex items-center justify-center mx-auto relative z-10 group-hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}>
          {icon}
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      
      {/* Step Content */}
      <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50 group-hover:shadow-xl group-hover:border-primary/20 transition-all duration-300 min-h-[200px] flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold mb-3 text-primary group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
});

StepCard.displayName = 'StepCard';

// Optimized Pain Point Card with memo
export interface PainPointCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const PainPointCard = memo(({ title, description, icon }: PainPointCardProps) => {
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
});

PainPointCard.displayName = 'PainPointCard';