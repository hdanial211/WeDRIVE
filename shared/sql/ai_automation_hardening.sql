-- WeDRIVE - AI automation indexes and RLS evaluation optimization

CREATE INDEX IF NOT EXISTS ai_notification_log_campaign_idx
  ON public.ai_notification_log (campaign_id);

CREATE INDEX IF NOT EXISTS ai_notification_log_customer_idx
  ON public.ai_notification_log (customer_id);

CREATE INDEX IF NOT EXISTS ai_notification_log_booking_idx
  ON public.ai_notification_log (booking_id);

DROP POLICY IF EXISTS "Admins can manage AI campaigns" ON public.ai_campaigns;
CREATE POLICY "Admins can manage AI campaigns"
ON public.ai_campaigns FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE lower(admins.email) = lower(((select auth.jwt()) ->> 'email'))
      AND lower(admins.role) = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE lower(admins.email) = lower(((select auth.jwt()) ->> 'email'))
      AND lower(admins.role) = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can view AI notification log" ON public.ai_notification_log;
CREATE POLICY "Admins can view AI notification log"
ON public.ai_notification_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE lower(admins.email) = lower(((select auth.jwt()) ->> 'email'))
      AND lower(admins.role) = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can manage document AI reviews" ON public.document_ai_reviews;
CREATE POLICY "Admins can manage document AI reviews"
ON public.document_ai_reviews FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE lower(admins.email) = lower(((select auth.jwt()) ->> 'email'))
      AND lower(admins.role) = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE lower(admins.email) = lower(((select auth.jwt()) ->> 'email'))
      AND lower(admins.role) = 'admin'
  )
);
