import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause, X, Mail, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NurturingEnrollmentCardProps {
  enrollment: any;
  onPause: (enrollmentId: string) => void;
  onResume: (enrollmentId: string) => void;
  onCancel: (enrollmentId: string) => void;
  isPending: boolean;
}

export function NurturingEnrollmentCard({
  enrollment,
  onPause,
  onResume,
  onCancel,
  isPending
}: NurturingEnrollmentCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500">Pausado</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completo</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">{enrollment.nurturing_sequences.name}</h4>
              {getStatusBadge(enrollment.status)}
            </div>
            {enrollment.nurturing_sequences.description && (
              <p className="text-sm text-muted-foreground mb-2">
                {enrollment.nurturing_sequences.description}
              </p>
            )}
          </div>
          
          <div className="flex gap-1">
            {enrollment.status === 'active' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPause(enrollment.id)}
                disabled={isPending}
              >
                <Pause className="h-4 w-4" />
              </Button>
            )}
            {enrollment.status === 'paused' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResume(enrollment.id)}
                disabled={isPending}
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
            {enrollment.status !== 'completed' && enrollment.status !== 'cancelled' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCancel(enrollment.id)}
                disabled={isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {enrollment.current_step && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Step atual:</span>
              <div className="flex items-center gap-1">
                {getChannelIcon(enrollment.current_step.step_type)}
                <span className="font-medium">{enrollment.current_step.email_subject || `Step ${enrollment.current_step.step_order}`}</span>
                <Badge variant="outline" className="text-xs">
                  Step {enrollment.current_step.step_order}
                </Badge>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Iniciado:</span>
            <span>{format(new Date(enrollment.enrolled_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
          </div>

          {enrollment.next_action_at && enrollment.status === 'active' && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Próxima ação:</span>
              <span className="font-medium">
                {format(new Date(enrollment.next_action_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
          )}

          {enrollment.completed_at && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Completado:</span>
              <span>{format(new Date(enrollment.completed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
