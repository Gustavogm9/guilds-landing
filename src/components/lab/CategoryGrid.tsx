import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Grid } from '@/components/ui/grid';
import { Code, Gamepad2, Smartphone, Users, ArrowRight } from 'lucide-react';
import type { WorkshopCategory } from '@/hooks/useWorkshops';

interface CategoryGridProps {
  categories: WorkshopCategory[];
  className?: string;
}

const iconMap = {
  Code,
  Gamepad2,
  Smartphone,
  Users
};

export const CategoryGrid = ({ categories, className }: CategoryGridProps) => {
  const getIcon = (iconName?: string) => {
    if (!iconName || !(iconName in iconMap)) return Code;
    return iconMap[iconName as keyof typeof iconMap];
  };

  return (
    <Grid cols={2} gap="md" className={`md:grid-cols-4 ${className}`}>
      {categories.map((category) => {
        const Icon = getIcon(category.icon_name);
        
        return (
          <Link key={category.id} to={`/lab/trilhas/${category.slug}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-muted/30">
              <CardHeader className="text-center pb-3">
                <div 
                  className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: category.color || 'hsl(var(--primary))' }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </CardHeader>

              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-center gap-2 text-sm text-primary group-hover:text-primary-foreground">
                  <span>Explorar trilha</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </Grid>
  );
};