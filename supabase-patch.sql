-- ============================================================
--  Shosholoza Progress Hub – Supabase PATCH
--  Run this in your Supabase SQL Editor if you already ran
--  the original schema and need to fix the following:
--
--    1. Missing `motivation` column on councillor_applications
--    2. Missing councillor_applications table (if never created)
--    3. Missing RLS SELECT policy on investor_inquiries
--       (causes investor form to submit fine but show nothing
--        in the admin dashboard)
-- ============================================================


-- ────────────────────────────────────────────────────────────
--  FIX 1 — Add missing `motivation` column to the existing
--           councillor_applications table
--  Error it fixes:
--    "Could not find the 'motivation' column of
--     'councillor_applications' in the schema cache"
-- ────────────────────────────────────────────────────────────

alter table public.councillor_applications
  add column if not exists motivation text;


-- ────────────────────────────────────────────────────────────
--  FIX 2 — Create councillor_applications from scratch
--           (skip if the table already exists — FIX 1 covers it)
-- ────────────────────────────────────────────────────────────

create table if not exists public.councillor_applications (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null    default now(),
  name         text        not null,
  email        text        not null,
  phone        text        not null,
  municipality text        not null,
  motivation   text,
  user_agent   text,
  status       text        not null    default 'pending'
                 check (status in ('pending', 'approved', 'rejected'))
);

create index if not exists idx_councillor_applications_created_at
  on public.councillor_applications (created_at desc);

create index if not exists idx_councillor_applications_status
  on public.councillor_applications (status);

create index if not exists idx_councillor_applications_municipality
  on public.councillor_applications (municipality);

alter table public.councillor_applications enable row level security;

-- Policies (safe to re-run — do nothing if they already exist)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'councillor_applications' and policyname = 'anon_insert_councillor'
  ) then
    execute 'create policy "anon_insert_councillor" on public.councillor_applications for insert to anon with check (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'councillor_applications' and policyname = 'anon_select_councillor'
  ) then
    execute 'create policy "anon_select_councillor" on public.councillor_applications for select to anon using (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'councillor_applications' and policyname = 'anon_update_councillor'
  ) then
    execute 'create policy "anon_update_councillor" on public.councillor_applications for update to anon using (true) with check (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'councillor_applications' and policyname = 'anon_delete_councillor'
  ) then
    execute 'create policy "anon_delete_councillor" on public.councillor_applications for delete to anon using (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'councillor_applications' and policyname = 'auth_all_councillor'
  ) then
    execute 'create policy "auth_all_councillor" on public.councillor_applications for all to authenticated using (true) with check (true)';
  end if;
end;
$$;


-- ────────────────────────────────────────────────────────────
--  FIX 3 — Ensure investor_inquiries table exists and has
--           all required RLS policies
--  Problem it fixes:
--    Investor form submits successfully but records never
--    appear in the admin dashboard (0 rows returned).
--    Root cause: RLS is enabled but the SELECT policy for
--    the anon role is missing, so reads silently return [].
-- ────────────────────────────────────────────────────────────

create table if not exists public.investor_inquiries (
  id               uuid        primary key default gen_random_uuid(),
  created_at       timestamptz not null    default now(),
  full_name        text        not null,
  email            text        not null,
  phone            text        not null,
  company          text,
  investment_range text        not null,
  area_of_interest text        not null,
  message          text        not null,
  status           text        not null    default 'new'
                     check (status in ('new', 'contacted', 'declined')),
  user_agent       text
);

create index if not exists idx_investor_inquiries_created_at
  on public.investor_inquiries (created_at desc);

create index if not exists idx_investor_inquiries_status
  on public.investor_inquiries (status);

alter table public.investor_inquiries enable row level security;

-- Policies (safe to re-run — do nothing if they already exist)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'investor_inquiries' and policyname = 'anon_insert_investor'
  ) then
    execute 'create policy "anon_insert_investor" on public.investor_inquiries for insert to anon with check (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'investor_inquiries' and policyname = 'anon_select_investor'
  ) then
    execute 'create policy "anon_select_investor" on public.investor_inquiries for select to anon using (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'investor_inquiries' and policyname = 'anon_update_investor'
  ) then
    execute 'create policy "anon_update_investor" on public.investor_inquiries for update to anon using (true) with check (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'investor_inquiries' and policyname = 'anon_delete_investor'
  ) then
    execute 'create policy "anon_delete_investor" on public.investor_inquiries for delete to anon using (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'investor_inquiries' and policyname = 'auth_all_investor'
  ) then
    execute 'create policy "auth_all_investor" on public.investor_inquiries for all to authenticated using (true) with check (true)';
  end if;
end;
$$;


-- ────────────────────────────────────────────────────────────
--  Done!
--  After running this patch:
--    • Councillor form submissions will no longer fail with
--      the "motivation column not found" error.
--    • Investor inquiries will appear in the Admin Dashboard
--      under the Investors tab.
-- ────────────────────────────────────────────────────────────
