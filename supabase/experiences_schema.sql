-- ============================================================
-- Atlas Experiences — Experiences Marketplace Schema
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ─────────────────────────────────────────────
-- Operator Profiles (extends user_profiles)
-- ─────────────────────────────────────────────
create table if not exists operators (
  id                uuid primary key references auth.users(id) on delete cascade,
  business_name     text not null,
  slug              text not null unique,
  bio               text,
  city              text not null,
  phone             text,
  whatsapp          text,
  languages         text[] not null default array['English'],
  avatar_url        text,
  cover_url         text,
  years_experience  integer,
  license_number    text,
  license_image_url text,
  verified          boolean not null default false,
  stripe_account_id text,                          -- for future Stripe Connect payouts
  commission_rate   numeric(4,2) not null default 10.00, -- % Atlas Experiences takes
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists operators_slug_idx on operators(slug);
create index if not exists operators_city_idx on operators(city);

alter table operators enable row level security;
create policy "operators_public_read"  on operators for select using (verified = true);
create policy "operators_own_read"     on operators for select using (auth.uid() = id);
create policy "operators_own_insert"   on operators for insert with check (auth.uid() = id);
create policy "operators_own_update"   on operators for update using (auth.uid() = id);

-- ─────────────────────────────────────────────
-- Experience Categories
-- ─────────────────────────────────────────────
-- surf | desert | culture | food | wellness | adventure | water | photography | transport | day-trip

-- ─────────────────────────────────────────────
-- Experiences / Activities
-- ─────────────────────────────────────────────
create table if not exists experiences (
  id                uuid primary key default uuid_generate_v4(),
  operator_id       uuid not null references operators(id) on delete cascade,
  title             text not null,
  slug              text not null unique,
  category          text not null check (category in (
                      'surf','desert','culture','food','wellness',
                      'adventure','water','photography','transport','day-trip','other'
                    )),
  subcategory       text,                           -- e.g. "surfing lessons", "camel trek"
  description       text not null,
  highlights        text[] not null default '{}',   -- bullet points
  includes          text[] not null default '{}',   -- what's included
  excludes          text[] not null default '{}',   -- what's NOT included
  what_to_bring     text[] not null default '{}',
  city              text not null,
  meeting_point     text,
  duration_hours    numeric(4,1) not null,
  max_group_size    integer not null default 10,
  min_age           integer not null default 0,
  price_per_person  integer not null,               -- USD
  price_group       integer,                        -- optional group/private rate
  currency          text not null default 'USD',
  languages         text[] not null default array['English'],
  images            text[] not null default '{}',   -- up to 10 image URLs
  cancellation      text not null default '24h',    -- free_cancel, 48h, no_refund
  available_days    text[] not null default array['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
  featured          boolean not null default false,
  published         boolean not null default false,
  approved          boolean not null default false,
  total_bookings    integer not null default 0,
  avg_rating        numeric(3,2),
  review_count      integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists experiences_category_idx  on experiences(category, approved, published);
create index if not exists experiences_city_idx      on experiences(city, approved, published);
create index if not exists experiences_operator_idx  on experiences(operator_id);
create index if not exists experiences_featured_idx  on experiences(featured, approved, published);
create index if not exists experiences_slug_idx      on experiences(slug);

alter table experiences enable row level security;
create policy "experiences_public_read"  on experiences for select using (published = true and approved = true);
create policy "experiences_own_read"     on experiences for select using (
  auth.uid() = operator_id
);
create policy "experiences_own_insert"   on experiences for insert with check (auth.uid() = operator_id);
create policy "experiences_own_update"   on experiences for update using (auth.uid() = operator_id);

-- ─────────────────────────────────────────────
-- Booking Inquiries (MVP — no payment processing)
-- v2 will add Stripe Connect and real payment
-- ─────────────────────────────────────────────
create table if not exists bookings (
  id                uuid primary key default uuid_generate_v4(),
  experience_id     uuid not null references experiences(id) on delete set null,
  operator_id       uuid not null references operators(id) on delete set null,
  traveler_id       uuid references auth.users(id) on delete set null,
  -- Traveler details (captured even without account)
  traveler_name     text not null,
  traveler_email    text not null,
  traveler_phone    text,
  traveler_country  text,
  -- Booking details
  requested_date    date not null,
  group_size        integer not null default 1,
  special_requests  text,
  -- Pricing
  price_per_person  integer not null,
  total_price       integer not null,
  platform_fee      integer not null,               -- 10% of total_price
  operator_payout   integer not null,               -- 90% of total_price
  currency          text not null default 'USD',
  -- Status
  status            text not null default 'pending'
                      check (status in ('pending','confirmed','completed','cancelled','refunded')),
  confirmed_at      timestamptz,
  completed_at      timestamptz,
  cancelled_at      timestamptz,
  cancellation_reason text,
  -- Payment (v2 — Stripe)
  payment_status    text not null default 'unpaid'
                      check (payment_status in ('unpaid','paid','refunded')),
  stripe_payment_id text,
  -- Admin tracking
  operator_invoiced boolean not null default false, -- monthly invoice sent?
  operator_paid     boolean not null default false, -- operator paid their 10%?
  notes             text,
  created_at        timestamptz not null default now()
);

create index if not exists bookings_experience_idx  on bookings(experience_id, status);
create index if not exists bookings_operator_idx    on bookings(operator_id, status);
create index if not exists bookings_traveler_idx    on bookings(traveler_id);
create index if not exists bookings_date_idx        on bookings(requested_date);
create index if not exists bookings_invoiced_idx    on bookings(operator_invoiced, status);

alter table bookings enable row level security;

-- Travelers can insert (book)
create policy "bookings_insert"          on bookings for insert with check (true);
-- Travelers see their own bookings
create policy "bookings_own_read"        on bookings for select using (
  auth.uid() = traveler_id or auth.uid() = operator_id
);
-- Operators can update status of their bookings
create policy "bookings_operator_update" on bookings for update using (auth.uid() = operator_id);

-- ─────────────────────────────────────────────
-- Experience Reviews (replaces destination_reviews for experiences)
-- ─────────────────────────────────────────────
create table if not exists experience_reviews (
  id              uuid primary key default uuid_generate_v4(),
  experience_id   uuid not null references experiences(id) on delete cascade,
  booking_id      uuid references bookings(id) on delete set null,
  user_id         uuid references auth.users(id) on delete set null,
  display_name    text not null,
  rating          integer not null check (rating between 1 and 5),
  title           text,
  body            text not null,
  approved        boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists exp_reviews_exp_idx on experience_reviews(experience_id, approved);

alter table experience_reviews enable row level security;
create policy "exp_reviews_public_read" on experience_reviews for select using (approved = true);
create policy "exp_reviews_own_read"    on experience_reviews for select using (auth.uid() = user_id);
create policy "exp_reviews_insert"      on experience_reviews for insert with check (true);

-- ─────────────────────────────────────────────
-- Auto-update experiences avg_rating when review approved
-- ─────────────────────────────────────────────
create or replace function update_experience_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update experiences set
    avg_rating   = (select round(avg(rating)::numeric, 2) from experience_reviews where experience_id = new.experience_id and approved = true),
    review_count = (select count(*) from experience_reviews where experience_id = new.experience_id and approved = true)
  where id = new.experience_id;
  return new;
end;
$$;

create trigger after_review_approve
  after insert or update on experience_reviews
  for each row execute function update_experience_rating();

-- ─────────────────────────────────────────────
-- Storage bucket for experience images
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public) values
  ('experiences', 'experiences', true)
on conflict (id) do nothing;

drop policy if exists "exp_images_public_read"  on storage.objects;
drop policy if exists "exp_images_auth_upload"  on storage.objects;

create policy "exp_images_public_read" on storage.objects
  for select using (bucket_id = 'experiences');

create policy "exp_images_auth_upload" on storage.objects
  for insert with check (bucket_id = 'experiences' and auth.role() = 'authenticated');

create policy "exp_images_auth_delete" on storage.objects
  for delete using (bucket_id = 'experiences' and auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- Seed: Sample experiences (visible after operator approval)
-- ─────────────────────────────────────────────
-- (Insert via admin panel or portal — no seed data needed for marketplace)
