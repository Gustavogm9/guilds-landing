import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Github, ExternalLink } from 'lucide-react';
import type { WorkshopInstructor } from '@/hooks/useWorkshops';

interface InstructorCardProps {
  instructor: WorkshopInstructor;
  className?: string;
}

export const InstructorCard = ({ instructor, className }: InstructorCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="text-center pb-3">
        <div className="flex justify-center mb-3">
          <Avatar className="w-20 h-20 ring-2 ring-muted group-hover:ring-primary transition-colors">
            <AvatarImage src={instructor.avatar_url} alt={instructor.name} />
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {getInitials(instructor.name)}
            </AvatarFallback>
          </Avatar>
        </div>
        <h3 className="font-semibold text-lg">{instructor.name}</h3>
        {instructor.years_experience && (
          <p className="text-sm text-muted-foreground">
            {instructor.years_experience} anos de experiência
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        {instructor.bio && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {instructor.bio}
          </p>
        )}

        {/* Specialties */}
        {instructor.specialties && instructor.specialties.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Especialidades</h4>
            <div className="flex flex-wrap gap-1">
              {instructor.specialties.slice(0, 4).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {instructor.specialties.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{instructor.specialties.length - 4} mais
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="flex items-center gap-2 pt-2">
          {instructor.linkedin_url && (
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
              <a 
                href={instructor.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`LinkedIn de ${instructor.name}`}
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
          )}
          {instructor.github_url && (
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
              <a 
                href={instructor.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`GitHub de ${instructor.name}`}
              >
                <Github className="w-4 h-4" />
              </a>
            </Button>
          )}
          {instructor.portfolio_url && (
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
              <a 
                href={instructor.portfolio_url} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`Portfolio de ${instructor.name}`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};