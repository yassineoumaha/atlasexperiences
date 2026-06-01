-- Atlas Experiences — Chat / Messaging Schema
-- Run in Supabase SQL Editor

create table if not exists messages (
  id           uuid primary key default uuid_generate_v4(),
  booking_id   uuid not null references bookings(id) on delete cascade,
  sender_id    uuid not null references auth.users(id) on delete cascade,
  sender_name  text not null,
  sender_role  text not null check (sender_role in ('traveler','operator')),
  body         text not null,
  read         boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists messages_booking_idx on messages(booking_id, created_at);
create index if not exists messages_unread_idx  on messages(booking_id, read) where read = false;

alter table messages enable row level security;

-- Both parties in a booking can read messages
create policy "messages_read" on messages
  for select using (
    exists (
      select 1 from bookings b
      where b.id = messages.booking_id
        and (b.traveler_id = auth.uid() or b.operator_id = auth.uid())
    )
  );

-- Both parties can insert
create policy "messages_insert" on messages
  for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from bookings b
      where b.id = messages.booking_id
        and (b.traveler_id = auth.uid() or b.operator_id = auth.uid())
    )
  );

-- Mark own received messages as read
create policy "messages_mark_read" on messages
  for update using (
    exists (
      select 1 from bookings b
      where b.id = messages.booking_id
        and (b.traveler_id = auth.uid() or b.operator_id = auth.uid())
    )
  );

-- Enable Supabase Realtime on messages table
alter publication supabase_realtime add table messages;
