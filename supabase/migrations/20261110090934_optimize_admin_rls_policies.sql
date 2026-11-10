-- Avoid per-row JWT evaluation and duplicate permissive SELECT policies.
DROP POLICY IF EXISTS "admins manage service categories" ON public.service_categories;
DROP POLICY IF EXISTS "admins manage services" ON public.services;

CREATE POLICY "admins insert service categories"
ON public.service_categories FOR INSERT TO authenticated
WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admins update service categories"
ON public.service_categories FOR UPDATE TO authenticated
USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admins delete service categories"
ON public.service_categories FOR DELETE TO authenticated
USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admins insert services"
ON public.services FOR INSERT TO authenticated
WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admins update services"
ON public.services FOR UPDATE TO authenticated
USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admins delete services"
ON public.services FOR DELETE TO authenticated
USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "appointments admins manage" ON public.appointments;
CREATE POLICY "appointments admins manage"
ON public.appointments FOR ALL TO authenticated
USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "admins manage catalogue images" ON storage.objects;
CREATE POLICY "admins manage catalogue images"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'images'
  AND ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  bucket_id = 'images'
  AND ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);
