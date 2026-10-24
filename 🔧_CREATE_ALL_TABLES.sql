-- ============================================================
--  CREATE ALL REQUIRED TABLES FOR SHOSH APPLICATION
--  Run this ONCE in Supabase SQL Editor
--  https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql
-- ============================================================

-- ============================================================
-- 1. MEMBERSHIP APPLICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  membership_number text NOT NULL,
  full_name text NOT NULL,
  surname text NOT NULL,
  date_of_birth text,
  id_number text,
  phone_number text NOT NULL,
  email text,
  residential_address text,
  province text NOT NULL,
  city text NOT NULL,
  area_suburb text,
  signature_data_url text,
  user_agent text,
  status text DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS idx_membership_applications_created_at 
  ON public.membership_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_membership_applications_membership_number 
  ON public.membership_applications (membership_number);
CREATE INDEX IF NOT EXISTS idx_membership_applications_status 
  ON public.membership_applications (status);

-- ============================================================
-- 2. COUNCILLOR APPLICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.councillor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  municipality text NOT NULL,
  motivation text,
  status text DEFAULT 'pending',
  user_agent text
);

CREATE INDEX IF NOT EXISTS idx_councillor_applications_created_at 
  ON public.councillor_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_councillor_applications_status 
  ON public.councillor_applications (status);
CREATE INDEX IF NOT EXISTS idx_councillor_applications_municipality 
  ON public.councillor_applications (municipality);

-- ============================================================
-- 3. LUCKY DRAW ENTRIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lucky_draw_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  membership_id text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lucky_draw_entries_created_at 
  ON public.lucky_draw_entries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lucky_draw_entries_email 
  ON public.lucky_draw_entries (email);
CREATE INDEX IF NOT EXISTS idx_lucky_draw_entries_membership_id 
  ON public.lucky_draw_entries (membership_id);

-- ============================================================
-- 4. CONTACT MESSAGES TABLE (Optional - for contact form)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at 
  ON public.contact_messages (created_at DESC);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ============================================================
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.councillor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lucky_draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- DROP EXISTING POLICIES (Clean slate)
-- ============================================================
-- Membership Applications
DROP POLICY IF EXISTS "anon_insert_membership" ON public.membership_applications;
DROP POLICY IF EXISTS "anon_select_membership" ON public.membership_applications;
DROP POLICY IF EXISTS "anon_update_membership" ON public.membership_applications;
DROP POLICY IF EXISTS "auth_all_membership" ON public.membership_applications;

-- Councillor Applications
DROP POLICY IF EXISTS "anon_insert_councillor" ON public.councillor_applications;
DROP POLICY IF EXISTS "anon_select_councillor" ON public.councillor_applications;
DROP POLICY IF EXISTS "anon_update_councillor" ON public.councillor_applications;
DROP POLICY IF EXISTS "auth_all_councillor" ON public.councillor_applications;

-- Lucky Draw
DROP POLICY IF EXISTS "anon_insert_lucky_draw" ON public.lucky_draw_entries;
DROP POLICY IF EXISTS "anon_select_lucky_draw" ON public.lucky_draw_entries;
DROP POLICY IF EXISTS "anon_delete_lucky_draw" ON public.lucky_draw_entries;
DROP POLICY IF EXISTS "auth_all_lucky_draw" ON public.lucky_draw_entries;

-- Contact Messages
DROP POLICY IF EXISTS "anon_insert_contact" ON public.contact_messages;
DROP POLICY IF EXISTS "anon_select_contact" ON public.contact_messages;
DROP POLICY IF EXISTS "auth_all_contact" ON public.contact_messages;

-- ============================================================
-- CREATE RLS POLICIES FOR MEMBERSHIP APPLICATIONS
-- ============================================================
CREATE POLICY "anon_insert_membership"
  ON public.membership_applications FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_membership"
  ON public.membership_applications FOR SELECT TO anon USING (true);

CREATE POLICY "anon_update_membership"
  ON public.membership_applications FOR UPDATE TO anon USING (true);

CREATE POLICY "auth_all_membership"
  ON public.membership_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- CREATE RLS POLICIES FOR COUNCILLOR APPLICATIONS
-- ============================================================
CREATE POLICY "anon_insert_councillor"
  ON public.councillor_applications FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_councillor"
  ON public.councillor_applications FOR SELECT TO anon USING (true);

CREATE POLICY "anon_update_councillor"
  ON public.councillor_applications FOR UPDATE TO anon USING (true);

CREATE POLICY "auth_all_councillor"
  ON public.councillor_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- CREATE RLS POLICIES FOR LUCKY DRAW ENTRIES
-- ============================================================
CREATE POLICY "anon_insert_lucky_draw"
  ON public.lucky_draw_entries FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_lucky_draw"
  ON public.lucky_draw_entries FOR SELECT TO anon USING (true);

CREATE POLICY "anon_delete_lucky_draw"
  ON public.lucky_draw_entries FOR DELETE TO anon USING (true);

CREATE POLICY "auth_all_lucky_draw"
  ON public.lucky_draw_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- CREATE RLS POLICIES FOR CONTACT MESSAGES
-- ============================================================
CREATE POLICY "anon_insert_contact"
  ON public.contact_messages FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_contact"
  ON public.contact_messages FOR SELECT TO anon USING (true);

CREATE POLICY "auth_all_contact"
  ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- DONE! All tables created with proper security
-- ============================================================
