-- Create a cron job to check expired subscriptions daily at 2 AM UTC
SELECT cron.schedule(
  'check-expired-subscriptions-daily',
  '0 2 * * *', -- Daily at 2 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://waniryugscczamjzhhvy.supabase.co/functions/v1/check-expired-subscriptions',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbmlyeXVnc2NjemFtanpoaHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxODM2ODIsImV4cCI6MjA2OTc1OTY4Mn0.VuzJ7eF8VX1z6wXSAQu1gQYIvhJ8ZGc4eF_4OkIcg2g"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);