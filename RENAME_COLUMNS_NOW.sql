-- ============================================================
-- COPY THIS AND RUN IN SUPABASE SQL EDITOR NOW
-- https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql
-- ============================================================

-- Rename the columns in your Candidates table
ALTER TABLE "Candidates" RENAME TO membership_applications;

ALTER TABLE membership_applications RENAME COLUMN "Submitted" TO created_at;
ALTER TABLE membership_applications RENAME COLUMN "Membership #" TO membership_number;
ALTER TABLE membership_applications RENAME COLUMN "Full Name" TO full_name;
ALTER TABLE membership_applications RENAME COLUMN "Surname" TO surname;
ALTER TABLE membership_applications RENAME COLUMN "Province" TO province;
ALTER TABLE membership_applications RENAME COLUMN "City" TO city;
ALTER TABLE membership_applications RENAME COLUMN "Phone" TO phone_number;
ALTER TABLE membership_applications RENAME COLUMN "Email" TO email;
ALTER TABLE membership_applications RENAME COLUMN "Status" TO status;

-- Add missing columns
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS date_of_birth text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS id_number text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS residential_address text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS area_suburb text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS signature_data_url text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS user_agent text DEFAULT 'CSV Import';

-- Convert created_at from text to timestamptz
ALTER TABLE membership_applications ALTER COLUMN created_at TYPE timestamptz USING to_timestamp(created_at, 'YYYY/MM/DD');
ALTER TABLE membership_applications ALTER COLUMN created_at SET DEFAULT now();

-- Enable RLS
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "anon_select_membership" ON membership_applications;
CREATE POLICY "anon_select_membership" ON membership_applications FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_insert_membership" ON membership_applications;
CREATE POLICY "anon_insert_membership" ON membership_applications FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_membership" ON membership_applications;
CREATE POLICY "anon_update_membership" ON membership_applications FOR UPDATE TO anon USING (true);

DROP POLICY IF EXISTS "auth_all_membership" ON membership_applications;
CREATE POLICY "auth_all_membership" ON membership_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Verify
SELECT 'SUCCESS! Total candidates: ' || COUNT(*)::text FROM membership_applications;
SELECT * FROM membership_applications LIMIT 3;
