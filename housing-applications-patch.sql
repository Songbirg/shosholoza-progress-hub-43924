-- ============================================================
--  HOUSING APPLICATIONS TABLE PATCH
--  Run this in your Supabase SQL Editor to add housing functionality
--  https://supabase.com/dashboard → your project → SQL Editor
-- ============================================================

-- Create housing_applications table
create table if not exists public.housing_applications (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  full_names           text not null,
  id_number            text not null,
  residential_address  text not null,
  email                text not null,
  telephone            text not null,
  status               text not null default 'pending'
                         check (status in ('pending', 'approved', 'rejected', 'waiting_list'))
);

-- Create indexes for performance
create index if not exists idx_housing_applications_created_at
  on public.housing_applications (created_at desc);

create index if not exists idx_housing_applications_status
  on public.housing_applications (status);

-- Enable Row Level Security
alter table public.housing_applications enable row level security;

-- RLS Policies
-- Allow anyone (anon key) to INSERT a new housing application
create policy "anon_insert_housing"
  on public.housing_applications
  for insert
  to anon
  with check (true);

-- Allow anyone to SELECT (admin dashboard uses the anon key)
create policy "anon_select_housing"
  on public.housing_applications
  for select
  to anon
  using (true);

-- Allow anyone (anon key) to UPDATE (needed for admin status changes)
create policy "anon_update_housing"
  on public.housing_applications
  for update
  to anon
  using (true)
  with check (true);

-- Allow anyone (anon key) to DELETE
create policy "anon_delete_housing"
  on public.housing_applications
  for delete
  to anon
  using (true);

-- Allow authenticated users full read/write
create policy "auth_all_housing"
  on public.housing_applications
  for all
  to authenticated
  using (true)
  with check (true);

-- Done! The housing_applications table is now ready to use.
