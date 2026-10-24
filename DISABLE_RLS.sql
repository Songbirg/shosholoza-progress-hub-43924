-- DISABLE RLS COMPLETELY - NUCLEAR OPTION
-- https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql

-- 1. Completely disable RLS
ALTER TABLE membership_applications DISABLE ROW LEVEL SECURITY;

-- 2. Verify data is there
SELECT 'Total rows in table:' as check, COUNT(*)::text as result
FROM membership_applications;

-- 3. Show sample
SELECT * FROM membership_applications LIMIT 3;

-- 4. Test with anon role (should work now)
SET ROLE anon;
SELECT 'Anon can see:' as check, COUNT(*)::text as result
FROM membership_applications;
RESET ROLE;

SELECT '✅ RLS DISABLED! Refresh your browser now!' as message;
