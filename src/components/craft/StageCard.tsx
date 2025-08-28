import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import * as Icons from 'lucide-react';

interface StageCardProps {
  name: string;
  description: string;
  color: string;
  icon_name: string;
  display_order: number;
  ideasCount: number;
}

export const StageCard = ({
  name,
  description,
  color,
  icon_name,
  display_order,
  ideasCount
}: StageCardProps) => {
  // Get the icon component dynamically
  const IconComponent = Icons[icon_name as keyof typeof Icons] as React.ComponentType<any>;

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div 
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: color }}
      />
      
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${color}20`, color: color }}
            >
              {IconComponent && <IconComponent className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Etapa {display_order}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {ideasCount} {ideasCount === 1 ? 'projeto' : 'projetos'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-muted-foreground">
            Ver projetos nesta etapa →
          </span>
        </div>
      </CardContent>
    </Card>
  );
};