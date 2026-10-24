-- RUN THIS IN SUPABASE TO CHECK EVERYTHING
-- https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql

-- 1. Check if data exists
SELECT '1. Total candidates:' as check_step, COUNT(*)::text as result 
FROM membership_applications;

-- 2. Show sample data
SELECT '2. Sample data:' as check_step;
SELECT * FROM membership_applications LIMIT 3;

-- 3. Check table structure
SELECT '3. Columns:' as check_step;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'membership_applications'
ORDER BY ordinal_position;

-- 4. Check RLS is enabled and has correct policies
SELECT '4. RLS Status:' as check_step;
SELECT 
    tablename,
    rowsecurity as rls_enabled,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'membership_applications')::text as policy_count
FROM pg_tables 
WHERE tablename = 'membership_applications';

-- 5. Test if anon role can read
SET ROLE anon;
SELECT '5. Testing anon access:' as check_step, COUNT(*)::text as visible_rows
FROM membership_applications;
RESET ROLE;

-- 6. If test fails, fix policies
DROP POLICY IF EXISTS "anon_select_membership" ON membership_applications;
CREATE POLICY "anon_select_membership" 
    ON membership_applications 
    FOR SELECT 
    TO anon, authenticated
    USING (true);

-- 7. Test again
SET ROLE anon;
SELECT '6. After policy fix:' as check_step, COUNT(*)::text as visible_rows
FROM membership_applications;
RESET ROLE;

-- 8. Show what anon can see
SET ROLE anon;
SELECT * FROM membership_applications LIMIT 3;
RESET ROLE;
