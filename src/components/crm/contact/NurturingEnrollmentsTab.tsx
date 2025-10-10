import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Zap } from 'lucide-react';
import { NurturingEnrollmentCard } from '@/components/admin/NurturingEnrollmentCard';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NurturingEnrollmentsTabProps {
  contactId: string;
}

export function NurturingEnrollmentsTab({ contactId }: NurturingEnrollmentsTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>('');

  // Fetch enrollments for this contact
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['nurturing-enrollments', contactId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nurturing_enrollments')
        .select(`
          *,
          nurturing_sequences (
            name,
            description
          ),
          current_step:nurturing_sequence_steps!nurturing_enrollments_current_step_id_fkey (
            id,
            step_order,
            step_type,
            email_subject
          )
        `)
        .eq('contact_id', contactId)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!contactId
  });

  // Fetch available sequences
  const { data: availableSequences = [] } = useQuery({
    queryKey: ['nurturing-sequences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nurturing_sequences')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  // Pause/Resume/Cancel mutations
  const manageMutation = useMutation({
    mutationFn: async ({ enrollmentId, action }: { enrollmentId: string; action: 'pause' | 'resume' | 'cancel' }) => {
      const { data, error } = await supabase.functions.invoke('nurturing-sequence-executor', {
        body: {
          action,
          enrollment_id: enrollmentId
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      const actionLabels = {
        pause: 'pausado',
        resume: 'retomado',
        cancel: 'cancelado'
      };
      
      toast({
        title: 'Enrollment atualizado',
        description: `O enrollment foi ${actionLabels[variables.action]} com sucesso.`
      });
      
      queryClient.invalidateQueries({ queryKey: ['nurturing-enrollments', contactId] });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o enrollment.',
        variant: 'destructive'
      });
      console.error('Error managing enrollment:', error);
    }
  });

  // Manual enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: async (sequenceId: string) => {
      const { data, error } = await supabase.rpc('manual_enroll_contact', {
        p_contact_id: contactId,
        p_sequence_id: sequenceId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Enrollment criado',
        description: 'O contato foi inscrito na sequência com sucesso.'
      });
      
      queryClient.invalidateQueries({ queryKey: ['nurturing-enrollments', contactId] });
      setShowEnrollDialog(false);
      setSelectedSequenceId('');
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível inscrever o contato.',
        variant: 'destructive'
      });
      console.error('Error enrolling contact:', error);
    }
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando nurturing...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Sequências de Nurturing</h3>
          <p className="text-sm text-muted-foreground">
            Sequências automatizadas de engajamento para este contato
          </p>
        </div>
        <Button onClick={() => setShowEnrollDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Inscrever em Sequência
        </Button>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Este contato não está inscrito em nenhuma sequência de nurturing
            </p>
            <Button variant="outline" onClick={() => setShowEnrollDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Inscrever em Sequência
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {enrollments.map((enrollment) => (
            <NurturingEnrollmentCard
              key={enrollment.id}
              enrollment={enrollment}
              onPause={(id) => manageMutation.mutate({ enrollmentId: id, action: 'pause' })}
              onResume={(id) => manageMutation.mutate({ enrollmentId: id, action: 'resume' })}
              onCancel={(id) => manageMutation.mutate({ enrollmentId: id, action: 'cancel' })}
              isPending={manageMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Enrollment Dialog */}
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inscrever em Sequência</DialogTitle>
            <DialogDescription>
              Selecione uma sequência de nurturing para inscrever este contato.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sequência</label>
              <Select value={selectedSequenceId} onValueChange={setSelectedSequenceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma sequência..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSequences
                    .filter(seq => !enrollments.some(
                      e => e.sequence_id === seq.id && (e.status === 'active' || e.status === 'paused')
                    ))
                    .map((sequence) => (
                      <SelectItem key={sequence.id} value={sequence.id}>
                        {sequence.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {availableSequences.find(s => s.id === selectedSequenceId)?.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {availableSequences.find(s => s.id === selectedSequenceId)?.description}
                </p>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowEnrollDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => selectedSequenceId && enrollMutation.mutate(selectedSequenceId)}
                disabled={!selectedSequenceId || enrollMutation.isPending}
              >
                Inscrever
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
