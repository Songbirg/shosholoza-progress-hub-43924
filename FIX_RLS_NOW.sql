-- RUN THIS NOW - FIX RLS POLICIES
-- https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql

-- Drop all existing policies
DROP POLICY IF EXISTS "anon_select_membership" ON membership_applications;
DROP POLICY IF EXISTS "anon_insert_membership" ON membership_applications;
DROP POLICY IF EXISTS "anon_update_membership" ON membership_applications;
DROP POLICY IF EXISTS "auth_all_membership" ON membership_applications;

-- Create new policies that allow anon to read
CREATE POLICY "anon_select_membership" 
    ON membership_applications 
    FOR SELECT 
    TO anon, authenticated
    USING (true);

CREATE POLICY "anon_insert_membership" 
    ON membership_applications 
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "anon_update_membership" 
    ON membership_applications 
    FOR UPDATE 
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Test it works
SET ROLE anon;
SELECT 'SUCCESS! Anon can see ' || COUNT(*)::text || ' candidates' as result
FROM membership_applications;
RESET ROLE;

-- Show sample
SET ROLE anon;
SELECT * FROM membership_applications LIMIT 3;
RESET ROLE;
