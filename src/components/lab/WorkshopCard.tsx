import { Link } from 'react-router-dom';
import { Clock, Users, Trophy, Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Workshop } from '@/hooks/useWorkshops';

interface WorkshopCardProps {
  workshop: Workshop;
  className?: string;
}

export const WorkshopCard = ({ workshop, className }: WorkshopCardProps) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'intermediate': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'advanced': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return level;
    }
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border-muted/30 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {workshop.is_featured && (
                <Badge variant="default" className="px-2 py-1 bg-gradient-to-r from-primary to-accent">
                  <Star className="w-3 h-3 mr-1" />
                  Destaque
                </Badge>
              )}
              <Badge 
                variant="outline" 
                className={getDifficultyColor(workshop.difficulty_level)}
              >
                {getDifficultyText(workshop.difficulty_level)}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {workshop.title}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {workshop.short_description || workshop.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-3">
          {/* Category */}
          {workshop.category && (
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: workshop.category.color || 'hsl(var(--primary))' }}
              />
              <span className="text-sm text-muted-foreground">
                {workshop.category.name}
              </span>
            </div>
          )}

          {/* Workshop Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{workshop.duration_hours}h</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{workshop.instructors?.length || 1} instrutor{(workshop.instructors?.length || 1) > 1 ? 'es' : ''}</span>
            </div>
            {workshop.certificate_included && (
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>Certificado</span>
              </div>
            )}
          </div>

          {/* Modalities */}
          <div className="flex flex-wrap gap-1">
            {workshop.modalities?.map((modality, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {modality === 'online' ? 'Online' : 
                 modality === 'presential' ? 'Presencial' :
                 modality === 'in-company' ? 'In-company' : modality}
              </Badge>
            ))}
          </div>

          {/* Instructors */}
          {workshop.instructors && workshop.instructors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Por:</span>
              <div className="flex flex-wrap gap-1">
                {workshop.instructors.slice(0, 2).map((instructor, index) => (
                  <span key={instructor.id} className="text-xs font-medium">
                    {instructor.name}
                    {index < Math.min(workshop.instructors!.length, 2) - 1 && ', '}
                  </span>
                ))}
                {workshop.instructors.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{workshop.instructors.length - 2} mais
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="text-sm">
            <span className="text-muted-foreground">Preço </span>
            <span className="font-semibold">sob consulta</span>
          </div>
          <Button asChild variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Link to={`/lab/workshops/${workshop.slug}`}>
              Ver detalhes
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};