import { Clock, BookOpen } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface WorkshopModule {
  id: string;
  title: string;
  description?: string;
  duration_hours?: number;
  module_order: number;
  topics?: string[];
}

interface ModuleAccordionProps {
  modules: WorkshopModule[];
  className?: string;
}

export const ModuleAccordion = ({ modules, className }: ModuleAccordionProps) => {
  if (!modules || modules.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <Accordion type="single" collapsible className="w-full">
        {modules.map((module, index) => (
          <AccordionItem key={module.id} value={`module-${index}`}>
            <AccordionTrigger className="text-left hover:no-underline">
              <div className="flex items-center gap-3 pr-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {module.module_order}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-base">{module.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    {module.duration_hours && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{module.duration_hours}h</span>
                      </div>
                    )}
                    {module.topics && module.topics.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <BookOpen className="w-3 h-3" />
                        <span>{module.topics.length} tópicos</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="pl-11">
              <div className="space-y-3">
                {module.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {module.description}
                  </p>
                )}
                
                {module.topics && module.topics.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Tópicos abordados:</h5>
                    <div className="flex flex-wrap gap-1">
                      {module.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};