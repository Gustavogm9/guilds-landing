import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ScoreHistoryItem {
  id: string;
  score_type: string;
  old_value: number | null;
  new_value: number;
  change_reason: string | null;
  created_at: string;
}

interface ContactScoreTimelineProps {
  contactId: string;
}

export const ContactScoreTimeline = ({ contactId }: ContactScoreTimelineProps) => {
  const { data: history, isLoading } = useQuery({
    queryKey: ["contact-score-history", contactId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_contact_score_history")
        .select("*")
        .eq("contact_id", contactId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as ScoreHistoryItem[];
    },
    enabled: !!contactId,
  });

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Nenhum histórico de score disponível
        </CardContent>
      </Card>
    );
  }

  const getScoreTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      lead_score: "Lead Score",
      engagement_score: "Engajamento",
      icp_score: "ICP Score",
    };
    return labels[type] || type;
  };

  const getScoreDelta = (item: ScoreHistoryItem) => {
    if (item.old_value === null) return item.new_value;
    return item.new_value - item.old_value;
  };

  const getTrendIcon = (delta: number) => {
    if (delta > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (delta < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => {
            const delta = getScoreDelta(item);
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 border-b pb-4 last:border-0"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {getTrendIcon(delta)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getScoreTypeLabel(item.score_type)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleString("pt-BR")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.old_value !== null && (
                      <>
                        <span className={`text-lg font-semibold ${getScoreColor(item.old_value)}`}>
                          {item.old_value}
                        </span>
                        <span className="text-muted-foreground">→</span>
                      </>
                    )}
                    <span className={`text-lg font-semibold ${getScoreColor(item.new_value)}`}>
                      {item.new_value}
                    </span>
                    {delta !== 0 && (
                      <Badge
                        variant={delta > 0 ? "default" : "destructive"}
                        className="ml-2"
                      >
                        {delta > 0 ? "+" : ""}
                        {delta}
                      </Badge>
                    )}
                  </div>

                  {item.change_reason && (
                    <p className="text-sm text-muted-foreground">
                      {item.change_reason}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
