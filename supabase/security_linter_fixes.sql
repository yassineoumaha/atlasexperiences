-- ═════════════════════════════════════════════════════════════════════════════
-- Supabase security-linter fixes
-- Run in Supabase SQL Editor. Idempotent where practical.
--
-- Covers: mutable function search_path, overly-permissive INSERT RLS policies,
-- publicly-executable SECURITY DEFINER trigger functions, and public-bucket
-- listing. (The "leaked password protection" warning is a dashboard toggle —
-- see note at the bottom; it is NOT fixable via SQL.)
-- ═════════════════════════════════════════════════════════════════════════════

-- ── 1. Function search_path (0011) ──────────────────────────────────────────
-- Pin search_path so these functions can't be hijacked via a mutable path.
alter function public.update_updated_at() set search_path = public;
alter function public.get_driver_open_report_count(uuid) set search_path = public;
-- Rating trigger functions (also SECURITY DEFINER — see section 3).
alter function public.update_experience_rating() set search_path = public;
alter function public.update_operator_rating() set search_path = public;
alter function public.handle_new_user() set search_path = public;

-- ── 2. Overly-permissive INSERT policies (0024) ─────────────────────────────
-- These tables are written ONLY through service-role server actions/API routes
-- in the app (booking API, newsletter API, suggest action), which bypass RLS.
-- The public "WITH CHECK (true)" anon-insert policies are therefore unused and
-- just leave the tables open — drop them so anon can't insert directly.
drop policy if exists "bookings_insert"               on public.bookings;
drop policy if exists "newsletter_insert"             on public.newsletter_subscribers;
drop policy if exists "suggestions_insert"            on public.suggestions;
drop policy if exists "property_submissions_insert"   on public.property_submissions;
drop policy if exists "taxi_reports_insert"           on public.taxi_reports;
drop policy if exists "taxi_routes_insert"            on public.taxi_routes;

-- experience_reviews IS inserted by the logged-in user via the anon client
-- (submitExperienceReviewAction sets user_id = auth.uid()), so don't drop it —
-- tighten it from "anyone" to "the authenticated author only".
drop policy if exists "exp_reviews_insert" on public.experience_reviews;
create policy "exp_reviews_insert" on public.experience_reviews
  for insert to authenticated
  with check (auth.uid() = user_id);

-- ── 3. Publicly-executable SECURITY DEFINER functions (0028 / 0029) ──────────
-- These are TRIGGER functions (and one internal helper). Triggers still fire
-- after EXECUTE is revoked — revoking only removes the ability to call them
-- directly via /rest/v1/rpc, which nothing should do.
revoke execute on function public.handle_new_user()            from anon, authenticated;
revoke execute on function public.update_experience_rating()   from anon, authenticated;
revoke execute on function public.update_operator_rating()     from anon, authenticated;
-- Internal driver helper — not meant to be a public RPC.
revoke execute on function public.get_driver_open_report_count(uuid) from anon, authenticated;

-- ── 4. Public buckets allow listing (0025) — OPTIONAL, read first ────────────
-- For PUBLIC buckets, individual object URLs (https://.../object/public/...)
-- work WITHOUT any SELECT policy, so dropping these "list everything" policies
-- stops anonymous file LISTING while images still load. This is the lowest-risk
-- of the lot but is left COMMENTED so you can opt in deliberately and confirm
-- your galleries still display afterward.
--
-- Uncomment to apply:
-- drop policy if exists "public_read_blog"          on storage.objects;
-- drop policy if exists "gallery_public_read"       on storage.objects;
-- drop policy if exists "public_read_destinations"  on storage.objects;
-- drop policy if exists "exp_images_public_read"    on storage.objects;
-- drop policy if exists "public_read_properties"    on storage.objects;

-- ═════════════════════════════════════════════════════════════════════════════
-- 5. Leaked Password Protection (auth) — NOT SQL.
-- Enable in the dashboard: Authentication → Providers/Policies → "Leaked password
-- protection" (checks passwords against HaveIBeenPwned). Toggle it ON.
-- ═════════════════════════════════════════════════════════════════════════════
