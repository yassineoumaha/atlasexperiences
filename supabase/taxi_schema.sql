-- Imourig — Taxi Schema
-- Safe to run on a fresh project OR on top of the old schema (idempotent)
-- Run in: Supabase Dashboard → SQL Editor → New query

-- ─────────────────────────────────────────────
-- 1. Create tables (skipped if already exist)
-- ─────────────────────────────────────────────

create table if not exists taxi_drivers (
  id                   uuid primary key default uuid_generate_v4(),
  driver_name          text not null,
  phone                text not null,
  whatsapp             text,
  city                 text not null,
  languages            text[] not null default array['Arabic'],
  vehicle_type         text not null check (vehicle_type in ('petit-taxi','grand-taxi','minibus','4x4','vip')),
  seats                integer not null default 4,
  verified             boolean not null default false,
  photo_url            text,
  description          text,
  active               boolean not null default true,
  created_at           timestamptz not null default now()
);

create table if not exists taxi_routes (
  id             uuid primary key default uuid_generate_v4(),
  driver_id      uuid not null references taxi_drivers(id) on delete cascade,
  from_city      text not null,
  to_city        text not null,
  price_mad      integer not null,
  price_usd      integer,
  duration_mins  integer,
  notes          text,
  created_at     timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 2. Add new columns if they don't exist yet
--    (safe to run even if columns already exist)
-- ─────────────────────────────────────────────

alter table taxi_drivers
  add column if not exists verification_status text not null default 'pending'
    check (verification_status in ('pending','under_review','approved','rejected')),
  add column if not exists licence_number      text,
  add column if not exists licence_image_url   text,
  add column if not exists rejection_reason    text,
  add column if not exists reviewed_by         text,
  add column if not exists reviewed_at         timestamptz;

alter table taxi_routes
  add column if not exists transport_mode text not null default 'private'
    check (transport_mode in ('private','shared','both'));

-- ─────────────────────────────────────────────
-- 3. Incident / complaint reports table
-- ─────────────────────────────────────────────

create table if not exists taxi_reports (
  id                    uuid primary key default uuid_generate_v4(),
  driver_id             uuid references taxi_drivers(id) on delete set null,
  reported_driver_name  text,
  reported_phone        text,
  incident_city         text not null,
  incident_date         date not null,
  incident_type         text not null check (incident_type in (
                          'overcharging','scam','route_deviation',
                          'harassment','unsafe_driving','no_show','wrong_info','other'
                        )),
  description           text not null,
  reporter_name         text not null,
  reporter_contact      text not null,
  wants_follow_up       boolean not null default true,
  status                text not null default 'open'
                          check (status in ('open','under_review','resolved','dismissed')),
  admin_notes           text,
  resolved_at           timestamptz,
  created_at            timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 4. Indexes
-- ─────────────────────────────────────────────

create index if not exists taxi_drivers_city_idx    on taxi_drivers(city);
create index if not exists taxi_drivers_status_idx  on taxi_drivers(verification_status);
create index if not exists taxi_routes_from_idx     on taxi_routes(from_city);
create index if not exists taxi_routes_driver_idx   on taxi_routes(driver_id);
create index if not exists taxi_reports_driver_idx  on taxi_reports(driver_id);
create index if not exists taxi_reports_status_idx  on taxi_reports(status);

-- ─────────────────────────────────────────────
-- 5. Row Level Security
-- ─────────────────────────────────────────────

alter table taxi_drivers enable row level security;
alter table taxi_routes  enable row level security;
alter table taxi_reports enable row level security;

-- Drop old policies first (in case they exist from previous run)
drop policy if exists "taxi_drivers_public_read"  on taxi_drivers;
drop policy if exists "taxi_drivers_insert"       on taxi_drivers;
drop policy if exists "taxi_routes_public_read"   on taxi_routes;
drop policy if exists "taxi_routes_insert"        on taxi_routes;
drop policy if exists "taxi_reports_insert"       on taxi_reports;

-- Public sees only approved + active drivers
create policy "taxi_drivers_public_read" on taxi_drivers
  for select using (active = true and verification_status = 'approved');

-- Anyone can submit — always lands as pending
create policy "taxi_drivers_insert" on taxi_drivers
  for insert with check (verified = false and verification_status = 'pending');

-- Routes are readable if driver is approved (joined in app layer)
create policy "taxi_routes_public_read" on taxi_routes
  for select using (true);

create policy "taxi_routes_insert" on taxi_routes
  for insert with check (true);

-- Reports: anyone can file, nobody can read (admin uses service role)
create policy "taxi_reports_insert" on taxi_reports
  for insert with check (true);

-- ─────────────────────────────────────────────
-- 6. Storage bucket for licence uploads
-- ─────────────────────────────────────────────

insert into storage.buckets (id, name, public)
  values ('taxi-licences', 'taxi-licences', false)
  on conflict (id) do nothing;

drop policy if exists "taxi_licence_upload"      on storage.objects;
drop policy if exists "taxi_licence_admin_read"  on storage.objects;

-- Allow anyone (anon) to upload a licence file (drivers don't have accounts)
-- Files are private (bucket is not public) — only admin service role can read
create policy "taxi_licence_upload" on storage.objects
  for insert with check (bucket_id = 'taxi-licences');

-- Admin (service role) and authenticated users can read licence files
create policy "taxi_licence_admin_read" on storage.objects
  for select using (
    bucket_id = 'taxi-licences'
    and (auth.role() = 'service_role' or auth.role() = 'authenticated')
  );

-- ─────────────────────────────────────────────
-- 7. Helper function
-- ─────────────────────────────────────────────

create or replace function get_driver_open_report_count(driver_uuid uuid)
returns integer as $$
  select count(*)::integer from taxi_reports
  where driver_id = driver_uuid and status in ('open', 'under_review');
$$ language sql security definer;

-- ─────────────────────────────────────────────
-- 8. Seed / update existing drivers to approved
--    and fix route prices to 2026 tourist rates
-- ─────────────────────────────────────────────

-- Update any existing seed drivers to approved status
update taxi_drivers
  set verification_status = 'approved', verified = true,
      licence_number = 'TAXI-SEED-DEMO'
  where driver_name in (
    'Hassan — Marrakech Airport',
    'Youssef — Agadir Transfers',
    'Omar — Fes Medina'
  );

-- Fix old incorrect route prices
update taxi_routes set price_mad = 120, price_usd = 12
  where from_city = 'Marrakech Airport' and to_city = 'Marrakech Medina' and price_mad < 100;

update taxi_routes set price_mad = 900, price_usd = 90
  where from_city = 'Marrakech' and to_city = 'Essaouira' and price_mad < 500;

update taxi_routes set price_mad = 3500, price_usd = 350
  where from_city = 'Marrakech' and to_city like '%Merzouga%' and price_mad < 2000;

update taxi_routes set price_mad = 200, price_usd = 20
  where from_city = 'Agadir Airport' and price_mad < 100;

update taxi_routes set price_mad = 300, price_usd = 30
  where from_city = 'Agadir' and to_city = 'Taghazout' and price_mad < 100;

-- Insert fresh seed drivers only if table is empty after the update
insert into taxi_drivers (
  driver_name, phone, whatsapp, city, languages,
  vehicle_type, seats, verified, verification_status,
  licence_number, description
)
select
  v.driver_name, v.phone, v.whatsapp, v.city, v.languages,
  v.vehicle_type, v.seats, v.verified, v.verification_status,
  v.licence_number, v.description
from (values
  ('Hassan — Marrakech Transfers', '+212 600-000001', '+212 600-000001', 'marrakech',
   array['Arabic','French','English']::text[], 'grand-taxi', 6, true, 'approved',
   'TAXI-MKC-2018-0001', 'Airport transfers, medina runs, Sahara day trips. Licensed since 2018.'),
  ('Youssef — Agadir & Souss', '+212 600-000002', '+212 600-000002', 'agadir',
   array['Arabic','French','Spanish']::text[], 'grand-taxi', 6, true, 'approved',
   'TAXI-AGA-2019-0042', 'Agadir airport, Taghazout surf transfers, Souss valley tours. Spanish spoken.'),
  ('Omar — Fes City Expert', '+212 600-000003', '+212 600-000003', 'fes',
   array['Arabic','French','English']::text[], 'petit-taxi', 3, true, 'approved',
   'TAXI-FES-2020-0017', 'Fes medina specialist, airport transfers, Meknes & Volubilis excursions.')
) as v(driver_name, phone, whatsapp, city, languages, vehicle_type, seats, verified,
       verification_status, licence_number, description)
where not exists (
  select 1 from taxi_drivers where phone = v.phone
);

-- Insert routes for new seed drivers (skipped if driver already had routes)
insert into taxi_routes (driver_id, from_city, to_city, price_mad, price_usd, duration_mins, transport_mode, notes)
select d.id, r.from_city, r.to_city, r.price_mad, r.price_usd, r.duration_mins, r.transport_mode, r.notes
from taxi_drivers d
join (values
  ('Hassan — Marrakech Transfers', 'Marrakech Airport',   'Marrakech Medina',   120,  12,  30,  'private', 'No meter at RAK — always negotiate before entering'),
  ('Hassan — Marrakech Transfers', 'Marrakech',           'Essaouira',           900,  90,  165, 'private', 'Private car. Bus is 80–120 MAD if budget is priority'),
  ('Hassan — Marrakech Transfers', 'Marrakech',           'Ouarzazate',         1200, 120,  220, 'private', 'One-way or day trip'),
  ('Hassan — Marrakech Transfers', 'Marrakech',           'Merzouga (Sahara)',  3500, 350,  520, 'private', 'Full day, up to 6 passengers'),
  ('Youssef — Agadir & Souss',    'Agadir Airport',      'Agadir City Centre',  200,  20,   25, 'private', 'No official airport meter — negotiate before entering'),
  ('Youssef — Agadir & Souss',    'Agadir',              'Taghazout',           300,  30,   25, 'private', 'Shared bus no. 22 is 7–10 MAD if on a budget'),
  ('Youssef — Agadir & Souss',    'Agadir',              'Essaouira',           700,  70,  150, 'private', 'North along the Atlantic coast'),
  ('Omar — Fes City Expert',      'Fes Airport',         'Fes Medina',          200,  20,   20, 'private', 'No official airport meter'),
  ('Omar — Fes City Expert',      'Fes',                 'Meknes',              300,  30,   60, 'shared',  'Per seat shared grand taxi. Private ~600 MAD')
) as r(driver_name, from_city, to_city, price_mad, price_usd, duration_mins, transport_mode, notes)
  on d.driver_name = r.driver_name
where not exists (
  select 1 from taxi_routes tr where tr.driver_id = d.id and tr.from_city = r.from_city and tr.to_city = r.to_city
);
