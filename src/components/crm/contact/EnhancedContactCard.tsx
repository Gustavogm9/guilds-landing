import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  TrendingUp, 
  Target,
  MessageSquare,
  Clock,
  DollarSign,
  Star,
  Activity,
  ChevronRight
} from 'lucide-react';
import { CRMContact } from '@/hooks/useCRM';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EnhancedContactCardProps {
  contact: CRMContact;
  onViewDetails?: (contact: CRMContact) => void;
  onAddInteraction?: (contact: CRMContact) => void;
}

export function EnhancedContactCard({ 
  contact, 
  onViewDetails, 
  onAddInteraction 
}: EnhancedContactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getLifecycleColor = (stage?: string) => {
    switch (stage) {
      case 'lead': return 'bg-gray-500';
      case 'mql': return 'bg-blue-500';
      case 'sql': return 'bg-purple-500';
      case 'customer': return 'bg-green-500';
      case 'closed_lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLifecycleLabel = (stage?: string) => {
    switch (stage) {
      case 'lead': return 'Lead';
      case 'mql': return 'MQL';
      case 'sql': return 'SQL';
      case 'customer': return 'Cliente';
      case 'closed_lost': return 'Perdido';
      default: return 'Lead';
    }
  };

  const getProductCategoryLabel = (category: string) => {
    switch (category) {
      case 'software_apps': return 'Software & Apps';
      case 'automacao_ia': return 'Automação IA';
      case 'jogos_gamificacao': return 'Jogos & Gamificação';
      case 'consultoria': return 'Consultoria';
      case 'workshops': return 'Workshops';
      default: return category;
    }
  };

  const lastInteraction = contact.last_interaction_date 
    ? formatDistanceToNow(new Date(contact.last_interaction_date), { 
        addSuffix: true, 
        locale: ptBR 
      })
    : 'Nunca';

  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(contact.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">{contact.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className={`${getLifecycleColor(contact.lifecycle_stage)} text-white`}
                >
                  {getLifecycleLabel(contact.lifecycle_stage)}
                </Badge>
                {contact.lead_score && contact.lead_score > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3" />
                    {contact.lead_score}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Basic Info */}
        <div className="space-y-2">
          {contact.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {contact.email}
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              {contact.phone}
            </div>
          )}
          {(contact.company || contact.job_title) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-4 w-4" />
              {contact.job_title && contact.company 
                ? `${contact.job_title} em ${contact.company}`
                : contact.job_title || contact.company
              }
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {contact.engagement_score || 0}
            </div>
            <div className="text-xs text-muted-foreground">Engajamento</div>
          </div>
          {contact.icp_score && (
            <div className="text-center">
              <div className="text-lg font-semibold text-secondary">
                {contact.icp_score}%
              </div>
              <div className="text-xs text-muted-foreground">ICP Match</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Último contato</div>
            <div className="text-xs font-medium">{lastInteraction}</div>
          </div>
        </div>

        {/* Product Interest */}
        {contact.products_interest && contact.products_interest.length > 0 && (
          <div className="mt-3">
            <div className="text-xs font-medium text-muted-foreground mb-2">Produtos de Interesse</div>
            <div className="flex flex-wrap gap-1">
              {contact.products_interest.slice(0, 3).map((product, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {getProductCategoryLabel(product)}
                </Badge>
              ))}
              {contact.products_interest.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{contact.products_interest.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <>
            <Separator className="my-4" />
            <div className="space-y-4">
              {/* Timeline & Budget */}
              {(contact.decision_timeline || contact.budget_range) && (
                <div className="grid grid-cols-2 gap-4">
                  {contact.decision_timeline && (
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Timeline</div>
                      <div className="text-sm">{contact.decision_timeline}</div>
                    </div>
                  )}
                  {contact.budget_range && (
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Orçamento</div>
                      <div className="text-sm">{contact.budget_range}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Pain Points */}
              {contact.pain_points && contact.pain_points.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Dores Identificadas</div>
                  <div className="flex flex-wrap gap-1">
                    {contact.pain_points.map((pain, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {pain}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Action */}
              {contact.next_action && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Próxima Ação</div>
                  <div className="text-sm">{contact.next_action}</div>
                  {contact.next_action_date && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(contact.next_action_date), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {contact.notes && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Observações</div>
                  <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                    {contact.notes.slice(0, 150)}
                    {contact.notes.length > 150 && '...'}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onAddInteraction?.(contact)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Nova Interação
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails?.(contact)}
          >
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}