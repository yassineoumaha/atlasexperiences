-- Imourig — User Features Schema
-- Run AFTER schema.sql and taxi_schema.sql
-- Adds: destination photos, user profiles/roles, reviews

-- ─────────────────────────────────────────────
-- 1. Destination Photo Galleries (up to 10 per destination)
-- ─────────────────────────────────────────────
create table if not exists destination_photos (
  id              uuid primary key default uuid_generate_v4(),
  destination_slug text not null references destinations(slug) on delete cascade,
  storage_path    text not null,
  url             text not null,
  caption         text,
  display_order   integer not null default 0,
  uploaded_by     uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists dest_photos_slug_idx on destination_photos(destination_slug, display_order);

alter table destination_photos enable row level security;

create policy "dest_photos_public_read" on destination_photos for select using (true);
create policy "dest_photos_auth_insert" on destination_photos for insert with check (auth.role() = 'authenticated');
create policy "dest_photos_auth_delete" on destination_photos for delete using (auth.role() = 'authenticated');
create policy "dest_photos_auth_update" on destination_photos for update using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- 2. User Profiles with Roles
-- ─────────────────────────────────────────────
create table if not exists user_profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  display_name    text not null default '',
  bio             text,
  avatar_url      text,
  role            text not null default 'traveler'
                    check (role in ('traveler', 'blogger', 'lister', 'admin')),
  website         text,
  social_instagram text,
  social_twitter  text,
  verified        boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table user_profiles enable row level security;

create policy "profiles_public_read"  on user_profiles for select using (true);
create policy "profiles_own_update"   on user_profiles for update using (auth.uid() = id);
create policy "profiles_own_insert"   on user_profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into user_profiles (id, display_name, role)
  values (new.id, split_part(new.email, '@', 1), 'traveler')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─────────────────────────────────────────────
-- 3. Destination Reviews
-- ─────────────────────────────────────────────
create table if not exists destination_reviews (
  id               uuid primary key default uuid_generate_v4(),
  destination_slug text not null references destinations(slug) on delete cascade,
  user_id          uuid not null references auth.users(id) on delete cascade,
  display_name     text not null,
  rating           integer not null check (rating between 1 and 5),
  title            text not null,
  body             text not null,
  visit_month      text,
  travel_type      text check (travel_type in ('solo','couple','family','friends','business')),
  approved         boolean not null default false,
  created_at       timestamptz not null default now()
);

create index if not exists reviews_slug_idx on destination_reviews(destination_slug, approved, created_at desc);
create index if not exists reviews_user_idx on destination_reviews(user_id);

alter table destination_reviews enable row level security;

-- Only approved reviews are publicly visible
create policy "reviews_public_read" on destination_reviews
  for select using (approved = true);

-- Authenticated users can submit (pending approval)
create policy "reviews_auth_insert" on destination_reviews
  for insert with check (auth.uid() = user_id);

-- Users can see and delete their own reviews (approved or not)
create policy "reviews_own_select" on destination_reviews
  for select using (auth.uid() = user_id);

create policy "reviews_own_delete" on destination_reviews
  for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 4. Link blog_posts and properties to user profiles
-- ─────────────────────────────────────────────
alter table blog_posts  add column if not exists author_id uuid references auth.users(id) on delete set null;
alter table properties  add column if not exists lister_id uuid references auth.users(id) on delete set null;

-- ─────────────────────────────────────────────
-- 5. Storage bucket for destination photos
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public) values
  ('destination-gallery', 'destination-gallery', true)
on conflict (id) do nothing;

drop policy if exists "gallery_public_read"  on storage.objects;
drop policy if exists "gallery_auth_upload"  on storage.objects;
drop policy if exists "gallery_auth_delete"  on storage.objects;

create policy "gallery_public_read" on storage.objects
  for select using (bucket_id = 'destination-gallery');

create policy "gallery_auth_upload" on storage.objects
  for insert with check (bucket_id = 'destination-gallery' and auth.role() = 'authenticated');

create policy "gallery_auth_delete" on storage.objects
  for delete using (bucket_id = 'destination-gallery' and auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- 6. Admin review policy for destination_reviews
-- ─────────────────────────────────────────────
create policy "reviews_admin_all" on destination_reviews
  for all using (auth.role() = 'service_role');
