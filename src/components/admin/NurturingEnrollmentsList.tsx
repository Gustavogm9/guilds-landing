import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, PauseCircle, XCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface NurturingEnrollmentsListProps {
  sequenceId: string;
  onClose: () => void;
}

export function NurturingEnrollmentsList({
  sequenceId,
  onClose,
}: NurturingEnrollmentsListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["nurturing_enrollments", sequenceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nurturing_enrollments")
        .select(`
          *,
          crm_contacts(name, email),
          nurturing_sequences(name),
          nurturing_sequence_steps(email_subject, task_title, whatsapp_message, step_type)
        `)
        .eq("sequence_id", sequenceId)
        .order("enrolled_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.functions.invoke(
        "nurturing-sequence-executor",
        {
          body: {
            action: status === "active" ? "pause" : "resume",
            enrollment_id: id,
          },
        }
      );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nurturing_enrollments", sequenceId] });
      toast({
        title: "Success",
        description: "Enrollment status updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Active Enrollments</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Step</TableHead>
              <TableHead>Next Action</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments?.map((enrollment) => (
              <TableRow key={enrollment.id}>
                <TableCell className="font-medium">
                  {enrollment.crm_contacts?.name}
                </TableCell>
                <TableCell>{enrollment.crm_contacts?.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      enrollment.status === "active"
                        ? "default"
                        : enrollment.status === "completed"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {enrollment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {enrollment.nurturing_sequence_steps?.email_subject || 
                   enrollment.nurturing_sequence_steps?.task_title || 
                   enrollment.nurturing_sequence_steps?.whatsapp_message?.substring(0, 30) || 
                   "N/A"}
                </TableCell>
                <TableCell>
                  {enrollment.next_action_at
                    ? format(new Date(enrollment.next_action_at), "MMM dd, HH:mm")
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {format(new Date(enrollment.enrolled_at), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {enrollment.status === "active" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: enrollment.id,
                            status: "active",
                          })
                        }
                      >
                        <PauseCircle className="h-4 w-4" />
                      </Button>
                    ) : enrollment.status === "paused" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: enrollment.id,
                            status: "paused",
                          })
                        }
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
