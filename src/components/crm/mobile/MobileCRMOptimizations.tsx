import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  Calendar, 
  User, 
  Building,
  DollarSign,
  Clock,
  Target,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import { CRMDeal, CRMContact } from '@/hooks/useCRM';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MobileDealCardProps {
  deal: CRMDeal;
  onQuickAction: (action: 'call' | 'whatsapp' | 'email' | 'schedule', deal: CRMDeal) => void;
}

export function MobileDealCard({ deal, onQuickAction }: MobileDealCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="touch-manipulation">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {deal.contact ? getInitials(deal.contact.name) : 'ND'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm truncate">{deal.title}</h3>
                {deal.contact && (
                  <p className="text-xs text-muted-foreground truncate">
                    {deal.contact.name}
                  </p>
                )}
              </div>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh]">
                <SheetHeader>
                  <SheetTitle>{deal.title}</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-full mt-4">
                  <div className="space-y-4 pb-20">
                    {/* Deal Details */}
                    <div className="space-y-3">
                      {deal.value && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatCurrency(deal.value)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Probabilidade: {deal.probability}%</span>
                      </div>
                      
                      {deal.expected_close_date && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Fechamento: {new Date(deal.expected_close_date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    {deal.contact && (
                      <div className="space-y-3 pt-4 border-t">
                        <h4 className="font-medium">Informações do Contato</h4>
                        
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{deal.contact.name}</span>
                        </div>
                        
                        {deal.contact.company && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{deal.contact.company}</span>
                          </div>
                        )}
                        
                        {deal.contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{deal.contact.email}</span>
                          </div>
                        )}
                        
                        {deal.contact.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{deal.contact.phone}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {deal.description && (
                      <div className="space-y-3 pt-4 border-t">
                        <h4 className="font-medium">Descrição</h4>
                        <p className="text-sm text-muted-foreground">{deal.description}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          {/* Value and Probability */}
          <div className="flex items-center justify-between">
            {deal.value && (
              <span className="font-semibold text-sm">{formatCurrency(deal.value)}</span>
            )}
            <Badge variant="outline" className="text-xs">
              {deal.probability}%
            </Badge>
          </div>

          {/* Tags */}
          {deal.tags && deal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {deal.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {deal.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{deal.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Quick Actions */}
          {deal.contact && (
            <div className="flex gap-2 pt-2 border-t">
              {deal.contact.phone && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9"
                  onClick={() => onQuickAction('call', deal)}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Ligar</span>
                </Button>
              )}
              
              {deal.contact.phone && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9"
                  onClick={() => onQuickAction('whatsapp', deal)}
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </Button>
              )}
              
              {deal.contact.email && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9"
                  onClick={() => onQuickAction('email', deal)}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Email</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9"
                onClick={() => onQuickAction('schedule', deal)}
              >
                <Calendar className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Agendar</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MobileKanbanColumnProps {
  title: string;
  deals: CRMDeal[];
  color: string;
  onQuickAction: (action: 'call' | 'whatsapp' | 'email' | 'schedule', deal: CRMDeal) => void;
}

export function MobileKanbanColumn({ title, deals, color, onQuickAction }: MobileKanbanColumnProps) {
  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-background z-10 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <h3 className="font-medium">{title}</h3>
            <Badge variant="secondary" className="text-xs">
              {deals.length}
            </Badge>
          </div>
          
          {totalValue > 0 && (
            <span className="text-xs text-muted-foreground font-medium">
              {formatCurrency(totalValue)}
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        {deals.map(deal => (
          <MobileDealCard
            key={deal.id}
            deal={deal}
            onQuickAction={onQuickAction}
          />
        ))}
        
        {deals.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Nenhuma oportunidade</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface QuickActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  actions: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  }>;
}

export function QuickActionDrawer({ isOpen, onClose, actions }: QuickActionDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Ações Rápidas</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-2">
          {actions.map(action => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="w-full justify-start h-12"
                onClick={action.onClick}
              >
                <Icon className="h-5 w-5 mr-3" />
                {action.label}
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// Mobile-optimized swipe gestures hook
export function useSwipeGestures(onSwipeLeft?: () => void, onSwipeRight?: () => void) {
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}