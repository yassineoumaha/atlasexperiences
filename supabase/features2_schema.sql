-- Imourig — Features 2: Announcements, Suggestions, Area Guides, Operator Rating
-- Run in Supabase SQL Editor

-- 1. Announcements
create table if not exists announcements (
  id          uuid primary key default uuid_generate_v4(),
  message     text not null,
  type        text not null default 'info' check (type in ('info','warning','success','promo')),
  link_url    text,
  link_label  text,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz
);
alter table announcements enable row level security;
create policy "announcements_public_read" on announcements
  for select using (active = true and (expires_at is null or expires_at > now()));

-- 2. Suggestions
create table if not exists suggestions (
  id           uuid primary key default uuid_generate_v4(),
  sender_name  text,
  sender_email text,
  type         text not null default 'feature' check (type in ('feature','bug','content','operator','other')),
  message      text not null,
  status       text not null default 'new' check (status in ('new','reviewed','planned','done','declined')),
  admin_note   text,
  created_at   timestamptz not null default now()
);
alter table suggestions enable row level security;
create policy "suggestions_insert" on suggestions for insert with check (true);

-- 3. Operator Area Guides
create table if not exists operator_areas (
  id           uuid primary key default uuid_generate_v4(),
  operator_id  uuid not null references operators(id) on delete cascade,
  city         text not null,
  area_name    text not null,
  description  text not null,
  best_for     text[] default '{}',
  best_months  text[] default '{}',
  tips         text[] default '{}',
  images       text[] default '{}',
  published    boolean not null default true,
  created_at   timestamptz not null default now()
);
alter table operator_areas enable row level security;
create policy "areas_public_read" on operator_areas for select using (published = true);
create policy "areas_own_insert"  on operator_areas for insert with check (auth.uid() = operator_id);
create policy "areas_own_update"  on operator_areas for update using (auth.uid() = operator_id);
create policy "areas_own_delete"  on operator_areas for delete using (auth.uid() = operator_id);

-- 4. Operator rating columns
alter table operators add column if not exists avg_rating    numeric(3,2);
alter table operators add column if not exists review_count  integer not null default 0;
alter table operators add column if not exists ranking_score numeric(6,2) not null default 0;

-- Auto-update operator ranking when a review is inserted/updated
create or replace function update_operator_rating()
returns trigger language plpgsql security definer set search_path = public as $$
declare op_id uuid;
begin
  select operator_id into op_id from experiences where id = new.experience_id;
  if op_id is null then return new; end if;
  update operators set
    avg_rating    = (select round(avg(er.rating)::numeric,2) from experience_reviews er join experiences e on e.id=er.experience_id where e.operator_id=op_id and er.approved=true),
    review_count  = (select count(*) from experience_reviews er join experiences e on e.id=er.experience_id where e.operator_id=op_id and er.approved=true),
    ranking_score = (select coalesce(round((avg(er.rating)*ln(count(*)+1))::numeric,2),0) from experience_reviews er join experiences e on e.id=er.experience_id where e.operator_id=op_id and er.approved=true)
  where id = op_id;
  return new;
end;
$$;
drop trigger if exists trg_operator_rating on experience_reviews;
create trigger trg_operator_rating
  after insert or update on experience_reviews
  for each row execute function update_operator_rating();
