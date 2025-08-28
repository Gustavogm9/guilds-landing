import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Target, TrendingUp } from 'lucide-react';

interface CraftStage {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface IdeaCardProps {
  id: string;
  slug: string;
  title: string;
  problem_thesis: string;
  target_persona: string;
  next_steps: string;
  estimated_timeline: string;
  is_featured: boolean;
  stage?: CraftStage;
}

export const IdeaCard = ({
  slug,
  title,
  problem_thesis,
  target_persona,
  next_steps,
  estimated_timeline,
  is_featured,
  stage
}: IdeaCardProps) => {
  return (
    <Card className={`relative h-full transition-all duration-300 hover:shadow-lg ${
      is_featured ? 'ring-2 ring-primary/20' : ''
    }`}>
      {is_featured && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge variant="default" className="bg-accent text-accent-foreground">
            Destaque
          </Badge>
        </div>
      )}
      
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
          {stage && (
            <Badge 
              variant="secondary" 
              style={{ backgroundColor: stage.color, color: 'white' }}
            >
              {stage.name}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Problema</h4>
            <p className="text-sm line-clamp-3">{problem_thesis}</p>
          </div>
          
          <div className="flex items-start gap-2">
            <Target className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Público-alvo</h4>
              <p className="text-sm line-clamp-2">{target_persona}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Timeline</h4>
              <p className="text-sm">{estimated_timeline}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Próximos passos</h4>
              <p className="text-sm line-clamp-2">{next_steps}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild variant="outline" className="w-full group">
          <Link to={`/craft/ideias/${slug}`}>
            Ver detalhes
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};