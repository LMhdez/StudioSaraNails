-- Harden access to appointments, services, categories, and catalogue images.
-- Assign the existing owner account the server-controlled administrator role.
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
                       || jsonb_build_object('role', 'admin')
WHERE id = '389f0b05-b05f-40bb-9e99-a067512b5c38'::uuid;

DROP POLICY IF EXISTS "auth = all permissions" ON public.service_categories;
DROP POLICY IF EXISTS "auth = all permissions" ON public.services;

CREATE POLICY "admins manage service categories"
ON public.service_categories
FOR ALL TO authenticated
USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admins manage services"
ON public.services
FOR ALL TO authenticated
USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
ON public.service_categories, public.services FROM anon;
GRANT SELECT ON public.service_categories, public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE
ON public.service_categories, public.services TO authenticated;

DROP POLICY IF EXISTS "auth = all permissions" ON public.appointments;
DROP POLICY IF EXISTS "everyone can insert" ON public.appointments;
DROP POLICY IF EXISTS "appointments public availability read" ON public.appointments;
DROP POLICY IF EXISTS "appointments public pending booking insert" ON public.appointments;
DROP POLICY IF EXISTS "appointments admins manage" ON public.appointments;

CREATE POLICY "appointments public availability read"
ON public.appointments FOR SELECT TO anon USING (true);

CREATE POLICY "appointments public pending booking insert"
ON public.appointments FOR INSERT TO anon
WITH CHECK (status = 'pending' AND duration_hours = 4);

CREATE POLICY "appointments admins manage"
ON public.appointments FOR ALL TO authenticated
USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

REVOKE ALL PRIVILEGES ON public.appointments FROM PUBLIC, anon, authenticated;
GRANT INSERT (customer_name, customer_email, customer_phone, service_type,
              date, start_time, duration_hours, status)
ON public.appointments TO anon;
GRANT SELECT (id, date, start_time, duration_hours, status)
ON public.appointments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE
ON public.appointments TO authenticated;

ALTER VIEW public.appointments_public SET (security_invoker = true);
REVOKE ALL PRIVILEGES ON public.appointments_public FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.appointments_public TO anon, authenticated;

DROP POLICY IF EXISTS "logged can do anything 1ffg0oo_0" ON storage.objects;
DROP POLICY IF EXISTS "logged can do anything 1ffg0oo_1" ON storage.objects;
DROP POLICY IF EXISTS "logged can do anything 1ffg0oo_2" ON storage.objects;
DROP POLICY IF EXISTS "logged can do anything 1ffg0oo_3" ON storage.objects;

CREATE POLICY "admins manage catalogue images"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'images'
  AND (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  bucket_id = 'images'
  AND (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

REVOKE INSERT, UPDATE, DELETE ON storage.objects FROM anon;

ALTER FUNCTION public.broadcast_service_changes() SET search_path = '';
REVOKE EXECUTE ON FUNCTION public.broadcast_service_changes()
FROM PUBLIC, anon, authenticated;
