-- Records each logged-in user's acceptance of a given legal agreement version.
-- The hard-block consent gate writes here (best-effort) when a logged-in user
-- accepts; anonymous visitors are tracked in localStorage only. Used for an
-- audit trail of who accepted which Terms/Privacy version and when.
--
-- Idempotent. Run in Supabase SQL Editor.

create table if not exists legal_consents (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  version     text not null,
  email       text,
  accepted_at timestamptz not null default now(),
  unique (user_id, version)
);

create index if not exists legal_consents_user_idx on legal_consents(user_id);

alter table legal_consents enable row level security;

-- Users may read their own consent records.
drop policy if exists "legal_consents_own_read" on legal_consents;
create policy "legal_consents_own_read" on legal_consents
  for select using (auth.uid() = user_id);

-- Inserts/updates go through the service-role server action (recordLegalConsentAction),
-- which bypasses RLS — so no public insert policy is granted here.
