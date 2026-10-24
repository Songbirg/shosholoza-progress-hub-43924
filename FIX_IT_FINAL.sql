-- FINAL FIX - CHECK EVERYTHING AND FIX RLS
-- https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql

-- 1. Show what we have
SELECT '=== TABLE STATUS ===' as step;
SELECT COUNT(*) as total_rows FROM membership_applications;

-- 2. Show columns
SELECT '=== COLUMNS ===' as step;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'membership_applications'
ORDER BY ordinal_position;

-- 3. Show sample data
SELECT '=== SAMPLE DATA ===' as step;
SELECT * FROM membership_applications LIMIT 2;

-- 4. Check RLS status
SELECT '=== RLS STATUS ===' as step;
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'membership_applications';

-- 5. DISABLE RLS COMPLETELY (temporary for testing)
ALTER TABLE membership_applications DISABLE ROW LEVEL SECURITY;

-- 6. Test if it works now
SELECT '=== TESTING WITHOUT RLS ===' as step;
SET ROLE anon;
SELECT COUNT(*) as anon_can_see FROM membership_applications;
RESET ROLE;

-- 7. Re-enable RLS with correct policies
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- 8. Drop ALL existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON membership_applications;
DROP POLICY IF EXISTS "anon_select_membership" ON membership_applications;
DROP POLICY IF EXISTS "anon_insert_membership" ON membership_applications;
DROP POLICY IF EXISTS "anon_update_membership" ON membership_applications;
DROP POLICY IF EXISTS "auth_all_membership" ON membership_applications;

-- 9. Create simple public read policy
CREATE POLICY "public_read" ON membership_applications
    FOR SELECT USING (true);

CREATE POLICY "public_insert" ON membership_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "public_update" ON membership_applications
    FOR UPDATE USING (true) WITH CHECK (true);

-- 10. Final test
SELECT '=== FINAL TEST ===' as step;
SET ROLE anon;
SELECT COUNT(*) || ' rows visible to anon' as result FROM membership_applications;
SELECT * FROM membership_applications LIMIT 2;
RESET ROLE;

SELECT '✅ DONE! Now refresh your browser at http://localhost:8080/admin/applications' as final_message;
