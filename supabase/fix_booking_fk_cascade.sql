-- ─────────────────────────────────────────────────────────────────────────────
-- Fix: admin "delete operator / delete experience" silently fails.
--
-- bookings.experience_id and bookings.operator_id were declared
--   `uuid not null references ... on delete set null`
-- which is self-contradictory: deleting the parent tries to SET the column to
-- NULL, but the column is NOT NULL, so Postgres raises a not_null_violation
-- (23502) and rolls back the entire DELETE. The operator/experience therefore
-- never disappears from the admin panel.
--
-- An admin hard-delete should take the dependent bookings with it, so we switch
-- both constraints to ON DELETE CASCADE. (experiences -> operators and
-- experience_reviews / commissions / operator_payouts already cascade.)
--
-- Idempotent: safe to run more than once. Constraint names follow Postgres'
-- default <table>_<column>_fkey convention; adjust if yours differ.
-- ─────────────────────────────────────────────────────────────────────────────

alter table bookings drop constraint if exists bookings_operator_id_fkey;
alter table bookings
  add constraint bookings_operator_id_fkey
  foreign key (operator_id) references operators(id) on delete cascade;

alter table bookings drop constraint if exists bookings_experience_id_fkey;
alter table bookings
  add constraint bookings_experience_id_fkey
  foreign key (experience_id) references experiences(id) on delete cascade;
