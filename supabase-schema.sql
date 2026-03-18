-- ============================================================
--  Shosholoza Progress Hub – Supabase Schema
--  Run this entire file once in your Supabase SQL Editor:
--  https://supabase.com/dashboard → your project → SQL Editor
-- ============================================================


-- ────────────────────────────────────────────────────────────
--  1. MEMBERSHIP APPLICATIONS
-- ────────────────────────────────────────────────────────────

create table if not exists public.membership_applications (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  membership_number    text not null unique,
  full_name            text not null,
  surname              text not null,
  date_of_birth        date not null,
  id_number            text not null,
  phone_number         text not null,
  email                text,
  residential_address  text not null,
  province             text not null,
  city                 text not null,
  area_suburb          text not null,
  signature_data_url   text,
  user_agent           text,
  status               text not null default 'pending'
                         check (status in ('pending', 'approved', 'rejected'))
);

-- Indexes
create index if not exists idx_membership_applications_created_at
  on public.membership_applications (created_at desc);

create index if not exists idx_membership_applications_status
  on public.membership_applications (status);

create index if not exists idx_membership_applications_province
  on public.membership_applications (province);

-- Row Level Security
alter table public.membership_applications enable row level security;

-- Allow anyone (anon key) to INSERT a new application
create policy "anon_insert_membership"
  on public.membership_applications
  for insert
  to anon
  with check (true);

-- Allow anyone to SELECT (admin dashboard uses the anon key)
-- ⚠️  Replace this with an auth-based policy once you add login to the admin page
create policy "anon_select_membership"
  on public.membership_applications
  for select
  to anon
  using (true);

-- Allow anyone (anon key) to UPDATE (needed for admin status changes)
create policy "anon_update_membership"
  on public.membership_applications
  for update
  to anon
  using (true)
  with check (true);

-- Allow anyone (anon key) to DELETE
create policy "anon_delete_membership"
  on public.membership_applications
  for delete
  to anon
  using (true);

-- Allow authenticated users full read/write
create policy "auth_all_membership"
  on public.membership_applications
  for all
  to authenticated
  using (true)
  with check (true);


-- ────────────────────────────────────────────────────────────
--  2. CONTACT MESSAGES
-- ────────────────────────────────────────────────────────────

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null
);

-- Indexes
create index if not exists idx_contact_messages_created_at
  on public.contact_messages (created_at desc);

-- Row Level Security
alter table public.contact_messages enable row level security;

-- Allow anyone (anon key) to INSERT a contact message
create policy "anon_insert_contact"
  on public.contact_messages
  for insert
  to anon
  with check (true);

-- Allow anyone to SELECT (admin dashboard)
-- ⚠️  Replace with an auth-based policy once you add login
create policy "anon_select_contact"
  on public.contact_messages
  for select
  to anon
  using (true);

-- Allow anyone (anon key) to UPDATE
create policy "anon_update_contact"
  on public.contact_messages
  for update
  to anon
  using (true)
  with check (true);

-- Allow anyone (anon key) to DELETE
create policy "anon_delete_contact"
  on public.contact_messages
  for delete
  to anon
  using (true);

-- Allow authenticated users full read/write
create policy "auth_all_contact"
  on public.contact_messages
  for all
  to authenticated
  using (true)
  with check (true);


-- ────────────────────────────────────────────────────────────
--  3. PATCH: Run this block if you already ran the schema above
--     and need to add the missing UPDATE / DELETE policies only
-- ────────────────────────────────────────────────────────────

-- Uncomment and run these if the policies above already exist:
-- create policy "anon_update_membership" on public.membership_applications for update to anon using (true) with check (true);
-- create policy "anon_delete_membership" on public.membership_applications for delete to anon using (true);
-- create policy "anon_update_contact"    on public.contact_messages        for update to anon using (true) with check (true);
-- create policy "anon_delete_contact"    on public.contact_messages        for delete to anon using (true);

-- To delete the test row inserted during verification:
-- delete from public.membership_applications where membership_number = 'SHOSH-TEST-001';


-- ────────────────────────────────────────────────────────────
--  4. HELPER: updated_at trigger (optional, future-proof)
-- ────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ────────────────────────────────────────────────────────────
--  Done!  Next steps:
--  1. Copy your Project URL + anon key from
--     Supabase Dashboard → Settings → API
--  2. Add them to your .env file:
--       VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
--       VITE_SUPABASE_ANON_KEY=eyJ...
--  3. Deploy / restart your dev server
-- ────────────────────────────────────────────────────────────
