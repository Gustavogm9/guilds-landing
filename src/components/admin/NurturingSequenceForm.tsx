import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { NurturingStepForm } from "./NurturingStepForm";
import { useState } from "react";

interface NurturingSequenceFormProps {
  sequence?: any;
  onSuccess: () => void;
}

export function NurturingSequenceForm({ sequence, onSuccess }: NurturingSequenceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showStepsForm, setShowStepsForm] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: sequence || {
      name: "",
      description: "",
      trigger_type: "score_threshold",
      trigger_conditions: {},
      is_active: true,
    },
  });

  const triggerType = watch("trigger_type");

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (sequence?.id) {
        const { error } = await supabase
          .from("nurturing_sequences")
          .update(data)
          .eq("id", sequence.id);
        if (error) throw error;
      } else {
        const { data: newSequence, error } = await supabase
          .from("nurturing_sequences")
          .insert(data)
          .select()
          .single();
        if (error) throw error;
        return newSequence;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["nurturing_sequences"] });
      toast({
        title: "Success",
        description: sequence?.id ? "Sequence updated" : "Sequence created",
      });
      if (!sequence?.id && data) {
        setShowStepsForm(true);
      } else {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  if (showStepsForm && !sequence?.id) {
    return (
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Sequence created! Now add steps to it.
        </p>
        <NurturingStepForm
          sequenceId={saveMutation.data?.id}
          onSuccess={onSuccess}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Sequence Name</Label>
        <Input id="name" {...register("name")} required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div>
        <Label htmlFor="trigger_type">Trigger Type</Label>
        <Select
          value={triggerType}
          onValueChange={(value) => setValue("trigger_type", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score_threshold">Score Threshold</SelectItem>
            <SelectItem value="lead_stage">Lead Stage</SelectItem>
            <SelectItem value="behavior">Behavior</SelectItem>
            <SelectItem value="time_based">Time Based</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {triggerType === "score_threshold" && (
        <div>
          <Label htmlFor="score_min">Minimum Score</Label>
          <Input
            id="score_min"
            type="number"
            {...register("trigger_conditions.score_min")}
            placeholder="e.g., 50"
          />
        </div>
      )}

      {triggerType === "lead_stage" && (
        <div>
          <Label htmlFor="stage">Lead Stage</Label>
          <Input
            id="stage"
            {...register("trigger_conditions.stage")}
            placeholder="e.g., qualified"
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving..." : sequence?.id ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
