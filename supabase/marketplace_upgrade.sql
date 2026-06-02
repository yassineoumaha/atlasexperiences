-- ============================================================
-- Imourig — Marketplace Upgrade (Phase 0)
-- Adds operator profile/verification fields + commission tracking
-- architecture. NO payment processing — tracking tables only.
-- Run in: Supabase Dashboard → SQL Editor → New query
-- Safe to re-run (idempotent: IF NOT EXISTS / additive only).
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. Operator profile gaps (marketplace fields)
-- ─────────────────────────────────────────────
alter table operators add column if not exists founded_year         integer;
alter table operators add column if not exists service_regions      text[] not null default array[]::text[];
alter table operators add column if not exists response_time        text;            -- e.g. "within 2 hours"
alter table operators add column if not exists booking_success_rate numeric(5,2);    -- 0–100 %

-- Verification lifecycle: pending → verified | rejected.
-- Keeps the existing boolean `verified` in sync for backward compat.
alter table operators add column if not exists verification_status text not null default 'pending'
  check (verification_status in ('pending', 'verified', 'rejected'));

-- Backfill status from the legacy boolean so existing verified operators stay verified.
update operators set verification_status = 'verified' where verified = true and verification_status <> 'verified';

-- ─────────────────────────────────────────────
-- 2. Commissions — one row per confirmed booking (tracking only)
-- ─────────────────────────────────────────────
create table if not exists commissions (
  id                uuid primary key default gen_random_uuid(),
  booking_id        uuid not null references bookings(id) on delete cascade,
  operator_id       uuid not null references operators(id) on delete cascade,
  booking_value     numeric(10,2) not null,
  commission_amount numeric(10,2) not null,
  rate              numeric(4,2)  not null,        -- % applied at time of booking
  status            text not null default 'pending'
                      check (status in ('pending', 'invoiced', 'paid', 'waived')),
  created_at        timestamptz not null default now()
);

create unique index if not exists commissions_booking_idx on commissions(booking_id);
create index        if not exists commissions_operator_idx on commissions(operator_id);

alter table commissions enable row level security;
create policy "commissions_operator_read" on commissions for select using (auth.uid() = operator_id);
-- Inserts/updates happen server-side via the service-role key (bypasses RLS).

-- ─────────────────────────────────────────────
-- 3. Operator payouts — periodic earnings rollup (tracking only)
-- ─────────────────────────────────────────────
create table if not exists operator_payouts (
  id               uuid primary key default gen_random_uuid(),
  operator_id      uuid not null references operators(id) on delete cascade,
  period           text not null,                  -- e.g. "2026-06"
  total_earnings   numeric(10,2) not null default 0,   -- operator payout total
  total_commission numeric(10,2) not null default 0,   -- Imourig commission total
  status           text not null default 'pending'
                     check (status in ('pending', 'invoiced', 'paid')),
  created_at       timestamptz not null default now()
);

create unique index if not exists operator_payouts_period_idx on operator_payouts(operator_id, period);

alter table operator_payouts enable row level security;
create policy "operator_payouts_operator_read" on operator_payouts for select using (auth.uid() = operator_id);
-- Inserts/updates happen server-side via the service-role key.

-- ============================================================
-- Done. Verify in Table Editor: operators has the 5 new columns,
-- and `commissions` + `operator_payouts` tables exist with RLS on.
-- ============================================================
