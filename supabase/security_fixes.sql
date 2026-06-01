-- ============================================================
-- Atlas Experiences — Security Hardening
-- Run in: Supabase Dashboard → SQL Editor → New query
-- Fixes common security advisor warnings
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. Fix mutable search_path on trigger function
--    Warning: "Function `update_updated_at` has a mutable search path"
-- ─────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger
language plpgsql
security invoker                    -- invoker is safer than definer for triggers
set search_path = public            -- locks search_path, prevents injection
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────
-- 2. Fix mutable search_path on report count function
--    Warning: "Function `get_driver_open_report_count` has a mutable search path"
-- ─────────────────────────────────────────────
create or replace function get_driver_open_report_count(driver_uuid uuid)
returns integer
language sql
security definer
set search_path = public            -- locks search_path
as $$
  select count(*)::integer
  from taxi_reports
  where driver_id = driver_uuid
    and status in ('open', 'under_review');
$$;

-- ─────────────────────────────────────────────
-- 3. Ensure RLS is enabled on ALL tables
--    Warning: "Row level security is not enabled on table X"
-- ─────────────────────────────────────────────
alter table if exists destinations          enable row level security;
alter table if exists properties            enable row level security;
alter table if exists blog_posts            enable row level security;
alter table if exists newsletter_subscribers enable row level security;
alter table if exists property_submissions  enable row level security;
alter table if exists saved_trips           enable row level security;
alter table if exists taxi_drivers          enable row level security;
alter table if exists taxi_routes           enable row level security;
alter table if exists taxi_reports          enable row level security;

-- ─────────────────────────────────────────────
-- 4. Ensure anon cannot read sensitive tables
--    Newsletter and reports should never be public
-- ─────────────────────────────────────────────

-- Newsletter: anon can only insert (subscribe), never read
drop policy if exists "newsletter_select_anon" on newsletter_subscribers;

-- Reports: anon can only insert, never read (already no select policy)
-- No change needed — absence of a select policy blocks anon reads

-- Property submissions: anon can only insert, never read
drop policy if exists "property_submissions_select_anon" on property_submissions;

-- Saved trips: already locked to auth.uid() = user_id

-- ─────────────────────────────────────────────
-- 5. Restrict service_role access notice
--    The service_role key bypasses RLS by design — that's correct.
--    Make sure it's ONLY used server-side (it is — in createAdminClient).
-- ─────────────────────────────────────────────
-- No SQL needed — this is enforced by our app code (server-only).

-- ─────────────────────────────────────────────
-- 6. Tighten taxi_routes read policy
--    Currently "all routes public" — limit to routes from verified drivers only
-- ─────────────────────────────────────────────
drop policy if exists "taxi_routes_public_read" on taxi_routes;

create policy "taxi_routes_public_read" on taxi_routes
  for select using (
    exists (
      select 1 from taxi_drivers d
      where d.id = taxi_routes.driver_id
        and d.verification_status = 'approved'
        and d.active = true
    )
  );

-- ─────────────────────────────────────────────
-- Verification: check what policies exist
-- ─────────────────────────────────────────────
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
