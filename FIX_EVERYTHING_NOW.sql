-- ============================================================
-- RUN THIS IN SUPABASE NOW - FIXES EVERYTHING
-- https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql
-- ============================================================

-- First, let's check what tables and columns exist
SELECT 'Checking tables...' as status;

-- ============================================================
-- PART 1: CREATE COUNCILLOR TABLE (fixes the red error)
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

-- Enable RLS
ALTER TABLE public.councillor_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "anon_insert_councillor" ON public.councillor_applications;
DROP POLICY IF EXISTS "anon_select_councillor" ON public.councillor_applications;
DROP POLICY IF EXISTS "anon_update_councillor" ON public.councillor_applications;
DROP POLICY IF EXISTS "auth_all_councillor" ON public.councillor_applications;

CREATE POLICY "anon_insert_councillor"
  ON public.councillor_applications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_councillor"
  ON public.councillor_applications FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_councillor"
  ON public.councillor_applications FOR UPDATE TO anon USING (true);
CREATE POLICY "auth_all_councillor"
  ON public.councillor_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_councillor_applications_created_at 
  ON public.councillor_applications (created_at DESC);

-- ============================================================
-- PART 2: FIX MEMBERSHIP_APPLICATIONS TABLE
-- ============================================================

-- Check current state
SELECT 'Current columns in membership_applications:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'membership_applications' 
ORDER BY ordinal_position;

-- Create the table if it doesn't exist
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

-- Enable RLS
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "anon_insert_membership" ON public.membership_applications;
DROP POLICY IF EXISTS "anon_select_membership" ON public.membership_applications;
DROP POLICY IF EXISTS "anon_update_membership" ON public.membership_applications;
DROP POLICY IF EXISTS "auth_all_membership" ON public.membership_applications;

CREATE POLICY "anon_insert_membership"
  ON public.membership_applications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_membership"
  ON public.membership_applications FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_membership"
  ON public.membership_applications FOR UPDATE TO anon USING (true);
CREATE POLICY "auth_all_membership"
  ON public.membership_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Now rename columns if they have the wrong names
DO $$
BEGIN
    -- Rename columns only if they exist with the wrong name
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_applications' AND column_name = 'Membership #') THEN
        ALTER TABLE membership_applications RENAME COLUMN "Membership #" TO membership_number;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_applications' AND column_name = 'Full Name') THEN
        ALTER TABLE membership_applications RENAME COLUMN "Full Name" TO full_name;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_applications' AND column_name = 'Surname') THEN
        ALTER TABLE membership_applications RENAME COLUMN "Surname" TO surname;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_applications' AND column_name = 'Phone') THEN
        ALTER TABLE membership_applications RENAME COLUMN "Phone" TO phone_number;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_applications' AND column_name = 'Email') THEN
        ALTER TABLE membership_applications RENAME COLUMN "Email" TO email;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_applications' AND column_name = 'Province') THEN
        ALTER TABLE membership_applications RENAME COLUMN "Province" TO province;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_applications' AND column_name = 'City') THEN
        ALTER TABLE membership_applications RENAME COLUMN "City" TO city;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_applications' AND column_name = 'Status') THEN
        ALTER TABLE membership_applications RENAME COLUMN "Status" TO status;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_applications' AND column_name = 'Submitted') THEN
        ALTER TABLE membership_applications RENAME COLUMN "Submitted" TO submitted_temp;
    END IF;
END $$;

-- Add missing columns if they don't exist
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS date_of_birth text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS id_number text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS residential_address text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS area_suburb text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS signature_data_url text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS user_agent text;

-- Handle created_at column
DO $$
BEGIN
    -- If we have submitted_temp, convert it to created_at
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_applications' AND column_name = 'submitted_temp') THEN
        -- Add created_at if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_applications' AND column_name = 'created_at') THEN
            ALTER TABLE membership_applications ADD COLUMN created_at timestamptz DEFAULT now();
        END IF;
        
        -- Try to parse dates from submitted_temp
        UPDATE membership_applications 
        SET created_at = to_timestamp(submitted_temp, 'YYYY/MM/DD')
        WHERE submitted_temp ~ '^\d{4}/\d{2}/\d{2}$';
        
        -- Drop the temp column
        ALTER TABLE membership_applications DROP COLUMN submitted_temp;
    END IF;
    
    -- Make sure created_at exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_applications' AND column_name = 'created_at') THEN
        ALTER TABLE membership_applications ADD COLUMN created_at timestamptz DEFAULT now();
    END IF;
END $$;

-- ============================================================
-- PART 3: CREATE LUCKY DRAW TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lucky_draw_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  membership_id text NOT NULL
);

ALTER TABLE public.lucky_draw_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_lucky_draw" ON public.lucky_draw_entries;
DROP POLICY IF EXISTS "anon_select_lucky_draw" ON public.lucky_draw_entries;
DROP POLICY IF EXISTS "auth_all_lucky_draw" ON public.lucky_draw_entries;

CREATE POLICY "anon_insert_lucky_draw"
  ON public.lucky_draw_entries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_lucky_draw"
  ON public.lucky_draw_entries FOR SELECT TO anon USING (true);
CREATE POLICY "auth_all_lucky_draw"
  ON public.lucky_draw_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_lucky_draw_entries_created_at 
  ON public.lucky_draw_entries (created_at DESC);

-- ============================================================
-- FINAL CHECK
-- ============================================================
SELECT '✅ DONE! Checking results...' as status;

-- Show candidate count
SELECT 'Total candidates: ' || COUNT(*)::text as result
FROM membership_applications;

-- Show sample candidates
SELECT 
    membership_number,
    full_name,
    surname,
    phone_number,
    province,
    city,
    status
FROM membership_applications 
LIMIT 5;

-- If no data, show instructions
DO $$
DECLARE
    row_count int;
BEGIN
    SELECT COUNT(*) INTO row_count FROM membership_applications;
    
    IF row_count = 0 THEN
        RAISE NOTICE 'NO DATA FOUND! You need to import your CSV:';
        RAISE NOTICE '1. Go to Table Editor';
        RAISE NOTICE '2. Select membership_applications table';
        RAISE NOTICE '3. Click Insert → Import from CSV';
        RAISE NOTICE '4. Upload images/candidates.csv';
    ELSE
        RAISE NOTICE '✅ SUCCESS! % candidates found', row_count;
    END IF;
END $$;
