-- ============================================================
-- Atlas Experiences — Full Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────

-- Destinations
create table if not exists destinations (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  slug         text not null unique,
  description  text not null,
  hero_image   text,
  weather      text not null check (weather in ('hot','cool','warm','desert','windy','cold')),
  avg_stay     integer not null default 2,
  region       text not null,
  filters      text[] not null default '{}',
  featured     boolean not null default false,
  lat          numeric not null,
  lng          numeric not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Properties / Hotels
create table if not exists properties (
  id               uuid primary key default uuid_generate_v4(),
  destination_slug text not null references destinations(slug) on delete cascade,
  name             text not null,
  type             text not null check (type in ('riad','villa','hotel','resort','guesthouse','apartment')),
  rating           numeric(3,1) not null default 8.0 check (rating between 0 and 10),
  review_count     integer not null default 0,
  price_from       integer not null,
  currency         text not null default 'USD',
  image            text,
  amenities        text[] not null default '{}',
  booking_url      text not null,
  agoda_url        text,
  tripadvisor_url  text,
  description      text not null,
  featured         boolean not null default false,
  approved         boolean not null default true,
  submitted_by     uuid references auth.users(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Blog Posts
create table if not exists blog_posts (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  slug         text not null unique,
  excerpt      text not null,
  content      text not null default '',
  category     text not null,
  image        text,
  published_at timestamptz,
  read_time    integer not null default 5,
  author       text not null default 'Atlas Team',
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Newsletter subscribers
create table if not exists newsletter_subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text not null unique,
  locale     text not null default 'en',
  created_at timestamptz not null default now()
);

-- Property owner submissions (unauthenticated form)
create table if not exists property_submissions (
  id             uuid primary key default uuid_generate_v4(),
  property_name  text not null,
  city           text not null,
  property_type  text not null,
  booking_url    text not null,
  contact_email  text not null,
  contact_name   text not null,
  description    text,
  status         text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at     timestamptz not null default now()
);

-- Saved trips (requires auth)
create table if not exists saved_trips (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  data       jsonb not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
create index if not exists destinations_slug_idx on destinations(slug);
create index if not exists destinations_featured_idx on destinations(featured);
create index if not exists properties_destination_idx on properties(destination_slug);
create index if not exists properties_approved_idx on properties(approved);
create index if not exists blog_posts_slug_idx on blog_posts(slug);
create index if not exists blog_posts_published_idx on blog_posts(published, published_at desc);
create index if not exists saved_trips_user_idx on saved_trips(user_id);

-- ─────────────────────────────────────────────
-- AUTO-UPDATE updated_at TRIGGER
-- ─────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger destinations_updated_at before update on destinations for each row execute function update_updated_at();
create trigger properties_updated_at before update on properties for each row execute function update_updated_at();
create trigger blog_posts_updated_at before update on blog_posts for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
alter table destinations          enable row level security;
alter table properties            enable row level security;
alter table blog_posts            enable row level security;
alter table newsletter_subscribers enable row level security;
alter table property_submissions   enable row level security;
alter table saved_trips            enable row level security;

-- Public read: destinations (all)
create policy "destinations_public_read" on destinations
  for select using (true);

-- Public read: approved properties only
create policy "properties_public_read" on properties
  for select using (approved = true);

-- Public read: published blog posts only
create policy "blog_posts_public_read" on blog_posts
  for select using (published = true);

-- Newsletter: anyone can subscribe (insert), no one can read others
create policy "newsletter_insert" on newsletter_subscribers
  for insert with check (true);

-- Property submissions: anyone can submit
create policy "property_submissions_insert" on property_submissions
  for insert with check (true);

-- Saved trips: users can only see/edit their own
create policy "saved_trips_own" on saved_trips
  for all using (auth.uid() = user_id);

-- Admin: service role bypasses RLS (used in admin panel via SUPABASE_SERVICE_ROLE_KEY)

-- ─────────────────────────────────────────────
-- STORAGE BUCKETS
-- ─────────────────────────────────────────────
-- Run these separately in SQL editor or via Supabase Dashboard → Storage

insert into storage.buckets (id, name, public) values
  ('destinations', 'destinations', true),
  ('properties',   'properties',   true),
  ('blog',         'blog',         true)
on conflict (id) do nothing;

-- Public read on all image buckets
create policy "public_read_destinations" on storage.objects
  for select using (bucket_id = 'destinations');

create policy "public_read_properties" on storage.objects
  for select using (bucket_id = 'properties');

create policy "public_read_blog" on storage.objects
  for select using (bucket_id = 'blog');

-- Authenticated users can upload (admin check happens in app layer)
create policy "auth_upload_destinations" on storage.objects
  for insert with check (bucket_id = 'destinations' and auth.role() = 'authenticated');

create policy "auth_upload_properties" on storage.objects
  for insert with check (bucket_id = 'properties' and auth.role() = 'authenticated');

create policy "auth_upload_blog" on storage.objects
  for insert with check (bucket_id = 'blog' and auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- SEED: 16 Destinations
-- ─────────────────────────────────────────────
insert into destinations (name, slug, description, hero_image, weather, avg_stay, region, filters, featured, lat, lng) values
('Marrakech',  'marrakech',  'Historic medinas, vibrant souks, palaces, and the gateway to the Sahara desert.',              null, 'hot',    4, 'Marrakech-Safi',            array['culture','desert'],       true,  31.6295, -7.9811),
('Chefchaouen','chefchaouen','The blue-painted mountain town — artisanal crafts, Rif mountain hikes, and dreamlike alleyways.',null, 'cool',   2, 'Tangier-Tetouan-Al Hoceima',array['culture','mountain'],     true,  35.1688, -5.2636),
('Essaouira',  'essaouira',  'A windswept Atlantic port — kitesurfing, fresh seafood, and a laid-back medina vibe.',          null, 'windy',  3, 'Marrakech-Safi',            array['beach','surf','culture'], true,  31.5085, -9.7595),
('Fes',        'fes',        'Ancient medina, UNESCO-listed tanneries, religious schools — Morocco''s cultural heartbeat.',   null, 'hot',    3, 'Fès-Meknès',                array['culture'],                true,  34.0181, -5.0078),
('Agadir',     'agadir',     'Modern beach resort city — long sandy beaches, surf schools, and a booming nightlife scene.',   null, 'warm',   3, 'Souss-Massa',               array['beach','surf'],           true,  30.4278, -9.5981),
('Merzouga',   'merzouga',   'The edge of the Sahara — camel trekking over golden dunes and sleeping under desert stars.',    null, 'desert', 1, 'Draa-Tafilalet',            array['desert'],                 true,  31.0802, -4.0133),
('Tangier',    'tangier',    'The gateway between Africa and Europe — a cosmopolitan port city with a storied past.',         null, 'cool',   4, 'Tangier-Tetouan-Al Hoceima',array['culture','beach'],        true,  35.7595, -5.8340),
('Rabat',      'rabat',      'Morocco''s quiet capital — royal palaces, UNESCO-listed medina, and Atlantic gardens.',         null, 'cool',   3, 'Rabat-Salé-Kénitra',        array['culture','beach'],        true,  34.0209, -6.8416),
('Ouarzazate', 'ouarzazate', 'The Hollywood of Morocco — Kasbah Ait Ben Haddou, desert film studios, and oasis valleys.',    null, 'desert', 4, 'Draa-Tafilalet',            array['desert','culture'],       false, 30.9189, -6.8934),
('Taghazout',  'taghazout',  'Morocco''s surf capital — world-class breaks, beach yoga, and a surfer village atmosphere.',   null, 'warm',   5, 'Souss-Massa',               array['surf','beach'],           true,  30.5433, -9.7085),
('High Atlas', 'high-atlas', 'Trekking, Berber villages, and panoramic views — home of Toubkal, Africa''s highest peak.',   null, 'cold',   2, 'Marrakech-Safi',            array['mountain','culture'],     false, 31.0607, -7.9148),
('Casablanca', 'casablanca', 'Morocco''s economic capital — Art Deco architecture, the Hassan II Mosque, and city life.',    null, 'warm',   2, 'Casablanca-Settat',         array['culture'],                false, 33.5731, -7.5898),
('Asilah',     'asilah',     'A whitewashed coastal medina with murals — art festivals, sea ramparts, and fresh fish.',      null, 'cool',   2, 'Tangier-Tetouan-Al Hoceima',array['beach','culture'],        false, 35.4659, -6.0337),
('Dakhla',     'dakhla',     'The kite-surfing paradise — turquoise lagoon, wild desert, and untouched Atlantic beaches.',   null, 'warm',   5, 'Dakhla-Oued Ed-Dahab',     array['surf','beach','desert'],  false, 23.6848,-15.9570),
('Meknes',     'meknes',     'The forgotten imperial city — grand gates, medinas, and Roman ruins of Volubilis nearby.',     null, 'hot',    2, 'Fès-Meknès',                array['culture'],                false, 33.8935, -5.5473),
('Ifrane',     'ifrane',     'Morocco''s Little Switzerland — ski slopes, cedar forests, and the coolest temperatures.',    null, 'cold',   2, 'Fès-Meknès',                array['mountain'],               false, 33.5332, -5.1130)
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────
-- SEED: 6 Blog Posts
-- ─────────────────────────────────────────────
insert into blog_posts (title, slug, excerpt, content, category, read_time, published, published_at) values
('Your Perfect 10-Day Morocco Itinerary', '10-days-morocco-itinerary',
 'From the medinas of Fes to the dunes of Merzouga — the definitive 10-day route with real budget breakdowns.',
 '# 10-Day Morocco Itinerary\n\nFull article coming soon.', 'Itineraries', 12, true, now()),
('Is Morocco Safe in 2026? Honest Local Advice', 'is-morocco-safe-2026',
 'We cut through travel advisories and give you the actual risks, scams to watch for, and how to stay smart.',
 '# Is Morocco Safe?\n\nFull article coming soon.', 'Safety', 8, true, now()),
('Morocco Hotel Fees in 2026: What You''ll Actually Pay', 'morocco-hotel-fees-2026',
 'The tourist tax trap, resort fees, and service levies explained — with a city-by-city breakdown.',
 '# Hotel Fees\n\nFull article coming soon.', 'Budget', 6, true, now()),
('Taghazout vs Essaouira: Best Surf in Morocco?', 'taghazout-vs-essaouira-surf',
 'A head-to-head comparison for surfers of all levels — waves, camps, costs, and best months.',
 '# Surf Comparison\n\nFull article coming soon.', 'Surf', 9, true, now()),
('Morocco in June 2026: Weather, Festivals & Real Costs', 'morocco-june-2026',
 'What to expect in June: temperature by city, festivals, Ramadan timing, and which regions to avoid.',
 '# Morocco in June\n\nFull article coming soon.', 'Seasonal', 7, true, now()),
('What to Pack for Morocco: The Complete 2026 List', 'what-to-pack-morocco-2026',
 'From medina modesty to Sahara overnight — a practical, gender-specific packing guide.',
 '# Packing Guide\n\nFull article coming soon.', 'Tips', 10, true, now())
on conflict (slug) do nothing;
