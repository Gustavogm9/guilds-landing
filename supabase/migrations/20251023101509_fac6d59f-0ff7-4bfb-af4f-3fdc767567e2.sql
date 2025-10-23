-- Backfill old notification URLs to use the correct Board route
-- Changes /admin/crm?deal= to /admin/crm/board?deal=

UPDATE crm_notifications 
SET action_url = regexp_replace(
  action_url, 
  '^/admin/crm\?deal=', 
  '/admin/crm/board?deal='
) 
WHERE action_url LIKE '/admin/crm?deal=%';