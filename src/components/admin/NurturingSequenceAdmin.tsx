import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, PlayCircle, PauseCircle, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NurturingSequenceForm } from "./NurturingSequenceForm";
import { NurturingEnrollmentsList } from "./NurturingEnrollmentsList";
import { NurturingMetricsDashboard } from "./NurturingMetricsDashboard";

export function NurturingSequenceAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSequence, setEditingSequence] = useState<any>(null);

  const { data: sequences, isLoading } = useQuery({
    queryKey: ["nurturing_sequences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nurturing_sequences")
        .select(`
          *,
          nurturing_sequence_steps(count),
          nurturing_enrollments(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("nurturing_sequences")
        .update({ is_active: !is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nurturing_sequences"] });
      toast({
        title: "Success",
        description: "Sequence status updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteSequenceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("nurturing_sequences")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nurturing_sequences"] });
      toast({
        title: "Success",
        description: "Sequence deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (sequence: any) => {
    setEditingSequence(sequence);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSequence(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Metrics Dashboard */}
      <NurturingMetricsDashboard />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Nurturing Sequences</CardTitle>
              <CardDescription>
                Manage automated nurturing sequences for leads
              </CardDescription>
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingSequence(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Sequence
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingSequence ? "Edit Sequence" : "Create Sequence"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure the nurturing sequence details
                  </DialogDescription>
                </DialogHeader>
                <NurturingSequenceForm
                  sequence={editingSequence}
                  onSuccess={handleFormClose}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead>Active Enrollments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sequences?.map((sequence) => (
                <TableRow key={sequence.id}>
                  <TableCell className="font-medium">{sequence.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {sequence.trigger_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sequence.nurturing_sequence_steps?.[0]?.count || 0}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() => setSelectedSequence(sequence.id)}
                    >
                      {sequence.nurturing_enrollments?.[0]?.count || 0}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sequence.is_active ? "default" : "secondary"}>
                      {sequence.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(sequence)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleActiveMutation.mutate({
                            id: sequence.id,
                            is_active: sequence.is_active,
                          })
                        }
                      >
                        {sequence.is_active ? (
                          <PauseCircle className="h-4 w-4" />
                        ) : (
                          <PlayCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSequenceMutation.mutate(sequence.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedSequence && (
        <NurturingEnrollmentsList
          sequenceId={selectedSequence}
          onClose={() => setSelectedSequence(null)}
        />
      )}
    </div>
  );
}
