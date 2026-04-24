import { supabaseRaiox } from '@/lib/supabase-raiox';

export type AnswerValue = {
  question_key: string;
  value_text?: string | null;
  value_array?: string[] | null;
  value_free?: string | null;
};

export function useSaveAnswer() {
  const saveAnswers = async (diagnostic_id: string, block_number: number, answers: AnswerValue[]) => {
    if (!diagnostic_id || answers.length === 0) return { success: false, error: 'No data to save' };

    try {
      const payload = answers.map(ans => ({
        diagnostic_id,
        block_number,
        question_key: ans.question_key,
        value_text: ans.value_text || null,
        value_array: ans.value_array || null,
        value_free: ans.value_free || null,
        updated_at: new Date().toISOString()
      }));

      // Upsert answers based on diagnostic_id and question_key
      const { error } = await supabaseRaiox
        .from('diagnostic_answers')
        .upsert(payload, { onConflict: 'diagnostic_id, question_key' });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error('Error saving answers:', err);
      return { success: false, error: err.message };
    }
  };

  return { saveAnswers };
}
