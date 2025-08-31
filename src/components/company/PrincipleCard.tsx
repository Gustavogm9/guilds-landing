import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Principle } from '@/hooks/useCompanyData';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

interface PrincipleCardProps {
  principle: Principle;
}

export const PrincipleCard: React.FC<PrincipleCardProps> = ({ principle }) => {
  // Get the icon component from the string name
  const IconComponent = (Icons as any)[principle.icon] as LucideIcon;

  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:scale-105 bg-card border-border">
      <CardContent className="p-6 text-center">
        <div className="space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 transition-all duration-300 group-hover:from-primary/30 group-hover:to-accent/30">
              {IconComponent && (
                <IconComponent className="h-8 w-8 text-primary" />
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground">
            {principle.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {principle.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};