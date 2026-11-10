-- Enforce appointment availability atomically in PostgreSQL.
-- Pending and confirmed appointments occupy time; canceled appointments do not.
ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_duration_hours_positive
  CHECK (duration_hours > 0);

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_no_active_overlap
  EXCLUDE USING gist (
    tsrange(
      date + start_time,
      date + start_time + duration_hours * interval '1 hour',
      '[)'
    ) WITH &&
  )
  WHERE (status IN ('pending', 'confirmed'));
