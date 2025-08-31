import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Benefit } from '@/hooks/useCompanyData';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

interface BenefitCardProps {
  benefit: Benefit;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({ benefit }) => {
  // Get the icon component from the string name
  const IconComponent = (Icons as any)[benefit.icon] as LucideIcon;

  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg bg-card border-border">
      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Icon and Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              {IconComponent && (
                <IconComponent className="h-5 w-5 text-primary" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {benefit.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {benefit.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};