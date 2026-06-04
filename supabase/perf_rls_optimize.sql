-- ═════════════════════════════════════════════════════════════════════════════
-- Performance: optimize RLS policies (linters 0003 auth_rls_initplan + 0006
-- multiple_permissive_policies). Run in Supabase SQL Editor.
--
-- TWO mechanical, BEHAVIOR-IDENTICAL changes:
--   1. Wrap auth.uid()/auth.role() in a scalar subquery: auth.uid()
--      -> (select auth.uid()). Postgres then evaluates it ONCE per query
--      (an initplan) instead of once per row. Same result, far cheaper at scale.
--   2. Merge duplicate permissive SELECT policies (same table/role/action) into
--      a single policy with OR — identical access, one policy evaluation.
--
-- Each policy is DROP + CREATE with the SAME logic as the originals in the
-- schema files. Idempotent (drop if exists). If a policy name doesn't exist on
-- your DB, its drop is a no-op and the create re-adds it.
--
-- Wrapped in a transaction: if ANY statement fails, the whole thing rolls back,
-- so you can never end up with policies dropped-but-not-recreated (locked out).
-- ═════════════════════════════════════════════════════════════════════════════

begin;

-- ── operators: merge own_read + public_read; optimize own_* ──────────────────
drop policy if exists "operators_own_read"    on public.operators;
drop policy if exists "operators_public_read" on public.operators;
drop policy if exists "operators_own_insert"  on public.operators;
drop policy if exists "operators_own_update"  on public.operators;
create policy "operators_read" on public.operators
  for select using (verified = true or (select auth.uid()) = id);
create policy "operators_own_insert" on public.operators
  for insert with check ((select auth.uid()) = id);
create policy "operators_own_update" on public.operators
  for update using ((select auth.uid()) = id);

-- ── experiences: merge own_read + public_read; optimize own_* ────────────────
drop policy if exists "experiences_own_read"    on public.experiences;
drop policy if exists "experiences_public_read" on public.experiences;
drop policy if exists "experiences_own_insert"  on public.experiences;
drop policy if exists "experiences_own_update"  on public.experiences;
create policy "experiences_read" on public.experiences
  for select using (
    (published = true and approved = true) or (select auth.uid()) = operator_id
  );
create policy "experiences_own_insert" on public.experiences
  for insert with check ((select auth.uid()) = operator_id);
create policy "experiences_own_update" on public.experiences
  for update using ((select auth.uid()) = operator_id);

-- ── bookings: optimize own_read + operator_update ────────────────────────────
drop policy if exists "bookings_own_read"        on public.bookings;
drop policy if exists "bookings_operator_update" on public.bookings;
create policy "bookings_own_read" on public.bookings
  for select using (
    (select auth.uid()) = traveler_id or (select auth.uid()) = operator_id
  );
create policy "bookings_operator_update" on public.bookings
  for update using ((select auth.uid()) = operator_id);

-- ── experience_reviews: merge own_read + public_read; optimize insert ────────
drop policy if exists "exp_reviews_own_read"    on public.experience_reviews;
drop policy if exists "exp_reviews_public_read" on public.experience_reviews;
drop policy if exists "exp_reviews_insert"      on public.experience_reviews;
create policy "exp_reviews_read" on public.experience_reviews
  for select using (approved = true or (select auth.uid()) = user_id);
create policy "exp_reviews_insert" on public.experience_reviews
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- ── messages: optimize the three policies (logic unchanged) ──────────────────
drop policy if exists "messages_read"      on public.messages;
drop policy if exists "messages_insert"    on public.messages;
drop policy if exists "messages_mark_read" on public.messages;
create policy "messages_read" on public.messages
  for select using (
    exists (select 1 from public.bookings b
      where b.id = messages.booking_id
        and (b.traveler_id = (select auth.uid()) or b.operator_id = (select auth.uid())))
  );
create policy "messages_insert" on public.messages
  for insert with check (
    (select auth.uid()) = sender_id
    and exists (select 1 from public.bookings b
      where b.id = messages.booking_id
        and (b.traveler_id = (select auth.uid()) or b.operator_id = (select auth.uid())))
  );
create policy "messages_mark_read" on public.messages
  for update using (
    exists (select 1 from public.bookings b
      where b.id = messages.booking_id
        and (b.traveler_id = (select auth.uid()) or b.operator_id = (select auth.uid())))
  );

-- ── commissions / operator_payouts: optimize operator_read ───────────────────
drop policy if exists "commissions_operator_read" on public.commissions;
create policy "commissions_operator_read" on public.commissions
  for select using ((select auth.uid()) = operator_id);

drop policy if exists "operator_payouts_operator_read" on public.operator_payouts;
create policy "operator_payouts_operator_read" on public.operator_payouts
  for select using ((select auth.uid()) = operator_id);

-- ── operator_areas: optimize own_insert/update/delete ────────────────────────
drop policy if exists "areas_own_insert" on public.operator_areas;
drop policy if exists "areas_own_update" on public.operator_areas;
drop policy if exists "areas_own_delete" on public.operator_areas;
create policy "areas_own_insert" on public.operator_areas
  for insert with check ((select auth.uid()) = operator_id);
create policy "areas_own_update" on public.operator_areas
  for update using ((select auth.uid()) = operator_id);
create policy "areas_own_delete" on public.operator_areas
  for delete using ((select auth.uid()) = operator_id);

-- ── legal_consents: optimize own_read ────────────────────────────────────────
drop policy if exists "legal_consents_own_read" on public.legal_consents;
create policy "legal_consents_own_read" on public.legal_consents
  for select using ((select auth.uid()) = user_id);

-- ── user_profiles: optimize own_insert/update ────────────────────────────────
drop policy if exists "profiles_own_insert" on public.user_profiles;
drop policy if exists "profiles_own_update" on public.user_profiles;
create policy "profiles_own_insert" on public.user_profiles
  for insert with check ((select auth.uid()) = id);
create policy "profiles_own_update" on public.user_profiles
  for update using ((select auth.uid()) = id);

-- ── saved_trips: optimize own (for all) ──────────────────────────────────────
drop policy if exists "saved_trips_own" on public.saved_trips;
create policy "saved_trips_own" on public.saved_trips
  for all using ((select auth.uid()) = user_id);

-- ── destination_photos: optimize role checks (logic unchanged) ───────────────
drop policy if exists "dest_photos_auth_insert" on public.destination_photos;
drop policy if exists "dest_photos_auth_update" on public.destination_photos;
drop policy if exists "dest_photos_auth_delete" on public.destination_photos;
create policy "dest_photos_auth_insert" on public.destination_photos
  for insert with check ((select auth.role()) = 'authenticated');
create policy "dest_photos_auth_update" on public.destination_photos
  for update using ((select auth.role()) = 'authenticated');
create policy "dest_photos_auth_delete" on public.destination_photos
  for delete using ((select auth.role()) = 'authenticated');

-- ── destination_reviews: optimize + merge overlapping SELECT/INSERT/DELETE ───
-- Original: public_read (approved), own_select (own), auth_insert (own),
-- own_delete (own), admin_all (service_role for ALL). Service role bypasses RLS
-- anyway, so admin_all is redundant for the API roles flagged — but we keep an
-- equivalent admin policy and fold the duplicate SELECT/own policies together.
drop policy if exists "reviews_public_read" on public.destination_reviews;
drop policy if exists "reviews_own_select"  on public.destination_reviews;
drop policy if exists "reviews_auth_insert" on public.destination_reviews;
drop policy if exists "reviews_own_delete"  on public.destination_reviews;
drop policy if exists "reviews_admin_all"   on public.destination_reviews;
create policy "reviews_read" on public.destination_reviews
  for select using (
    approved = true
    or (select auth.uid()) = user_id
    or (select auth.role()) = 'service_role'
  );
create policy "reviews_insert" on public.destination_reviews
  for insert with check (
    (select auth.uid()) = user_id or (select auth.role()) = 'service_role'
  );
create policy "reviews_update_admin" on public.destination_reviews
  for update using ((select auth.role()) = 'service_role');
create policy "reviews_delete" on public.destination_reviews
  for delete using (
    (select auth.uid()) = user_id or (select auth.role()) = 'service_role'
  );

commit;

-- ═════════════════════════════════════════════════════════════════════════════
-- After running, re-run the linter: auth_rls_initplan and the merged
-- multiple_permissive_policies warnings should clear. Access behavior is
-- unchanged from the original policies.
-- ═════════════════════════════════════════════════════════════════════════════
