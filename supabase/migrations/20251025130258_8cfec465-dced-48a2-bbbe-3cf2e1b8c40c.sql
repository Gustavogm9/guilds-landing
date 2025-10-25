-- Fix RLS policy to allow updating broadcast notifications (user_id = NULL)
DROP POLICY IF EXISTS "Users can update their own notifications" 
  ON public.crm_notifications;

CREATE POLICY "Users can update notifications"
  ON public.crm_notifications FOR UPDATE
  USING (
    auth.uid() = user_id     -- Personal notifications
    OR 
    user_id IS NULL          -- Broadcast notifications (any user can mark as read)
  );