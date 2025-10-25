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
  ChevronRight,
  Sparkles,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { CRMContact } from '@/hooks/useCRM';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ICPQuickEditModal } from '@/components/admin/icp/ICPQuickEditModal';

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
  const [showICPModal, setShowICPModal] = useState(false);

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
              {/* ICP Profile Section with Breakdown */}
              {contact.icp_score !== null && contact.icp_score !== undefined && (
                <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Perfil ICP</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowICPModal(true)}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Completar Dados
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">Score ICP Total</div>
                      <Progress value={contact.icp_score} className="h-2" />
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {contact.icp_score}%
                    </div>
                  </div>

                  {/* ICP Breakdown from custom_fields */}
                  {contact.custom_fields?.icp_breakdown && (
                    <div className="space-y-2 mt-4">
                      {Object.entries(contact.custom_fields.icp_breakdown as Record<string, any>).map(([field, data]: [string, any]) => (
                        <div key={field} className="flex items-center justify-between p-2 bg-background/50 rounded">
                          <div className="flex items-center gap-2">
                            {data.matched ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{data.criterion_name}</p>
                              {data.contact_value && (
                                <p className="text-xs text-muted-foreground">
                                  {Array.isArray(data.contact_value) ? data.contact_value.join(', ') : data.contact_value}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant={data.matched ? 'default' : 'outline'} className="text-xs">
                            {data.points > 0 ? `+${data.points}` : '0'} pts
                          </Badge>
                        </div>
                      ))}

                      {/* Suggestions */}
                      {(() => {
                        const missingCriteria = Object.entries(contact.custom_fields.icp_breakdown as Record<string, any>)
                          .filter(([_, data]: [string, any]) => !data.matched && data.max_points > 0)
                          .sort((a: any, b: any) => b[1].max_points - a[1].max_points);
                        
                        if (missingCriteria.length > 0) {
                          const topMissing = missingCriteria[0];
                          return (
                            <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg mt-3">
                              <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Oportunidade</p>
                                <p className="text-xs text-muted-foreground">
                                  Complete "{topMissing[1].criterion_name}" para ganhar +{topMissing[1].max_points} pontos
                                </p>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}

                  {/* Fallback: Display basic ICP Fields if no breakdown */}
                  {!contact.custom_fields?.icp_breakdown && (
                    <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                      {contact.company_size && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>Porte: {contact.company_size}</span>
                        </div>
                      )}
                      {contact.industry && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>Indústria: {contact.industry}</span>
                        </div>
                      )}
                      {contact.budget_range && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>Orçamento: {contact.budget_range}</span>
                        </div>
                      )}
                      {contact.decision_timeline && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>Timeline: {contact.decision_timeline}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Qualification Data */}
              {(contact.job_title || contact.company_size || contact.industry || contact.decision_timeline || contact.budget_range) && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Dados de Qualificação</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {contact.job_title && (
                      <div>
                        <span className="text-muted-foreground">Cargo:</span> {contact.job_title}
                      </div>
                    )}
                    {contact.company_size && (
                      <div>
                        <span className="text-muted-foreground">Porte:</span> {contact.company_size}
                      </div>
                    )}
                    {contact.industry && (
                      <div>
                        <span className="text-muted-foreground">Indústria:</span> {contact.industry}
                      </div>
                    )}
                    {contact.budget_range && (
                      <div>
                        <span className="text-muted-foreground">Orçamento:</span> {contact.budget_range}
                      </div>
                    )}
                    {contact.decision_timeline && (
                      <div>
                        <span className="text-muted-foreground">Timeline:</span> {contact.decision_timeline}
                      </div>
                    )}
                  </div>
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

      {/* ICP Quick Edit Modal */}
      <ICPQuickEditModal
        open={showICPModal}
        onOpenChange={setShowICPModal}
        contactId={contact.id}
        contactName={contact.name}
        currentData={{
          job_title: contact.job_title,
          company_size: contact.company_size,
          industry: contact.industry,
          budget_range: contact.budget_range,
          decision_timeline: contact.decision_timeline,
        }}
        onSuccess={() => {
          // Refresh contact data would be handled by parent component
          setShowICPModal(false);
        }}
      />
    </Card>
  );
}