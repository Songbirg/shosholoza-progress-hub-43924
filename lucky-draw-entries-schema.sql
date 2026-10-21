-- ============================================================
--  LUCKY DRAW ENTRIES TABLE
--  Run this in your Supabase SQL Editor to add lucky draw functionality
--  https://supabase.com/dashboard → your project → SQL Editor
-- ============================================================

-- Create lucky_draw_entries table
create table if not exists public.lucky_draw_entries (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  full_name            text not null,
  email                text not null,
  phone                text not null,
  membership_id        text not null
);

-- Create indexes for performance
create index if not exists idx_lucky_draw_entries_created_at
  on public.lucky_draw_entries (created_at desc);

create index if not exists idx_lucky_draw_entries_email
  on public.lucky_draw_entries (email);

create index if not exists idx_lucky_draw_entries_membership_id
  on public.lucky_draw_entries (membership_id);

-- Enable Row Level Security
alter table public.lucky_draw_entries enable row level security;

-- RLS Policies
-- Allow anyone (anon key) to INSERT a new entry
create policy "anon_insert_lucky_draw"
  on public.lucky_draw_entries
  for insert
  to anon
  with check (true);

-- Allow anyone to SELECT (admin dashboard uses the anon key)
create policy "anon_select_lucky_draw"
  on public.lucky_draw_entries
  for select
  to anon
  using (true);

-- Allow anyone (anon key) to DELETE
create policy "anon_delete_lucky_draw"
  on public.lucky_draw_entries
  for delete
  to anon
  using (true);

-- Allow authenticated users full read/write
create policy "auth_all_lucky_draw"
  on public.lucky_draw_entries
  for all
  to authenticated
  using (true)
  with check (true);

-- Done! The lucky_draw_entries table is now ready to use.
