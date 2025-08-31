import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JobPosition } from '@/hooks/useCompanyData';
import { MapPin, Clock, DollarSign, Send } from 'lucide-react';

interface JobCardProps {
  position: JobPosition;
  onApply?: (position: JobPosition) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ position, onApply }) => {
  const modalityLabels = {
    remote: 'Remoto',
    hybrid: 'Híbrido',
    onsite: 'Presencial'
  };

  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg bg-card border-border">
      <CardHeader className="pb-4">
        <div className="space-y-2">
          <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {position.title}
          </CardTitle>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {modalityLabels[position.modality as keyof typeof modalityLabels] || position.modality}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {position.location}
            </Badge>
            
            {position.salary_range && (
              <Badge variant="outline" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {position.salary_range}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {position.description}
        </p>

        {/* Requirements */}
        {position.requirements && position.requirements.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Requisitos:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {position.requirements.slice(0, 3).map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{req}</span>
                </li>
              ))}
              {position.requirements.length > 3 && (
                <li className="text-xs text-primary">
                  +{position.requirements.length - 3} requisitos adicionais
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Apply Button */}
        <div className="pt-2">
          <Button 
            onClick={() => onApply?.(position)}
            className="w-full group/btn"
            size="sm"
          >
            <Send className="h-4 w-4 mr-2 transition-transform group-hover/btn:translate-x-1" />
            Candidatar-se
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};