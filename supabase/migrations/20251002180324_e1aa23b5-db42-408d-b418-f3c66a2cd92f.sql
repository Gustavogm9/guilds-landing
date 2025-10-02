-- Schedule the recurring activities generator to run daily at 2 AM
SELECT cron.schedule(
  'generate-recurring-activities-daily',
  '0 2 * * *', -- Every day at 2 AM
  $$
  SELECT net.http_post(
    url := 'https://itvruukwhgttnjpvghzq.supabase.co/functions/v1/generate-recurring-activities',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0dnJ1dWt3aGd0dG5qcHZnaHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjQ4MjgsImV4cCI6MjA3MTcwMDgyOH0.NWcAv2VONoAOKiXGHBMZAB42_SCPaI8nTxFTXw6GTBM'
    ),
    body := jsonb_build_object('scheduled', true)
  );
  $$
);