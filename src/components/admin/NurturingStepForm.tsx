import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NurturingStepFormProps {
  sequenceId: string;
  onSuccess: () => void;
}

export function NurturingStepForm({ sequenceId, onSuccess }: NurturingStepFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      step_type: "email",
      step_order: 1,
      delay_days: 0,
      delay_hours: 0,
      email_subject: "",
      email_content: "",
      whatsapp_message: "",
      task_title: "",
      task_description: "",
      webhook_url: "",
      webhook_payload: {},
    },
  });

  const stepType = watch("step_type");

  const { data: steps } = useQuery({
    queryKey: ["nurturing_steps", sequenceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nurturing_sequence_steps")
        .select("*")
        .eq("sequence_id", sequenceId)
        .order("step_order");

      if (error) throw error;
      return data;
    },
  });

  const addStepMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("nurturing_sequence_steps")
        .insert({
          sequence_id: sequenceId,
          ...data,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nurturing_steps", sequenceId] });
      toast({
        title: "Success",
        description: "Step added",
      });
      reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteStepMutation = useMutation({
    mutationFn: async (stepId: string) => {
      const { error } = await supabase
        .from("nurturing_sequence_steps")
        .delete()
        .eq("id", stepId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nurturing_steps", sequenceId] });
      toast({
        title: "Success",
        description: "Step deleted",
      });
    },
  });

  const onSubmit = (data: any) => {
    addStepMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Sequence Steps</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Delay</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps?.map((step) => {
              const stepName = step.email_subject || step.task_title || step.whatsapp_message || `Step ${step.step_order}`;
              return (
                <TableRow key={step.id}>
                  <TableCell>{step.step_order}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{stepName}</TableCell>
                  <TableCell>{step.step_type}</TableCell>
                  <TableCell>
                    {step.delay_days}d {step.delay_hours}h
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteStepMutation.mutate(step.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t pt-4">
        <h4 className="font-medium">Add New Step</h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="step_order">Step Order</Label>
            <Input
              id="step_order"
              type="number"
              {...register("step_order")}
              required
            />
          </div>

          <div>
            <Label htmlFor="step_type">Step Type</Label>
            <Select
              value={stepType}
              onValueChange={(value) => setValue("step_type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="wait">Wait</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="delay_days">Delay (Days)</Label>
            <Input
              id="delay_days"
              type="number"
              {...register("delay_days")}
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="delay_hours">Delay (Hours)</Label>
            <Input
              id="delay_hours"
              type="number"
              {...register("delay_hours")}
              min="0"
            />
          </div>
        </div>

        {stepType === "email" && (
          <>
            <div>
              <Label htmlFor="email_subject">Email Subject</Label>
              <Input
                id="email_subject"
                {...register("email_subject")}
                placeholder="e.g., Welcome to our service"
                required
              />
            </div>
            <div>
              <Label htmlFor="email_content">Email Content</Label>
              <Textarea
                id="email_content"
                {...register("email_content")}
                rows={4}
                required
              />
            </div>
          </>
        )}

        {stepType === "whatsapp" && (
          <div>
            <Label htmlFor="whatsapp_message">WhatsApp Message</Label>
            <Textarea
              id="whatsapp_message"
              {...register("whatsapp_message")}
              rows={4}
              required
            />
          </div>
        )}

        {stepType === "task" && (
          <>
            <div>
              <Label htmlFor="task_title">Task Title</Label>
              <Input
                id="task_title"
                {...register("task_title")}
                placeholder="e.g., Follow up with lead"
                required
              />
            </div>
            <div>
              <Label htmlFor="task_description">Task Description</Label>
              <Textarea
                id="task_description"
                {...register("task_description")}
                rows={3}
              />
            </div>
          </>
        )}

        {stepType === "webhook" && (
          <div>
            <Label htmlFor="webhook_url">Webhook URL</Label>
            <Input
              id="webhook_url"
              {...register("webhook_url")}
              placeholder="https://..."
              required
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={addStepMutation.isPending}>
            <Plus className="mr-2 h-4 w-4" />
            Add Step
          </Button>
          <Button type="button" variant="outline" onClick={onSuccess}>
            Done
          </Button>
        </div>
      </form>
    </div>
  );
}
