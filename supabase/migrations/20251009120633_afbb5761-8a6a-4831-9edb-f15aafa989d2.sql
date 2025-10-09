-- =============================================
-- Sprint 5: Cron Job para Nurturing Sequences
-- =============================================
-- Este cron job executa a cada 15 minutos para processar
-- enrollments pendentes de nurturing sequences

-- Remover cron job anterior se existir (ignorar erro se não existir)
DO $$
BEGIN
  PERFORM cron.unschedule('process-nurturing-enrollments');
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Criar cron job para processar nurturing enrollments
-- Executa a cada 15 minutos
SELECT cron.schedule(
  'process-nurturing-enrollments',
  '*/15 * * * *', -- A cada 15 minutos
  $$
  SELECT
    net.http_post(
      url := 'https://itvruukwhgttnjpvghzq.supabase.co/functions/v1/nurturing-sequence-executor?action=cron',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'triggered_by', 'cron',
        'timestamp', now()
      )
    ) as request_id;
  $$
);