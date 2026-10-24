-- Find out what's actually in the database
-- https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql

-- 1. Show ALL tables in the public schema
SELECT 'All tables:' as info;
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. For each table, show row count
SELECT 'Table row counts:' as info;

-- Check Candidates table (capital C)
SELECT 'Candidates' as table_name, COUNT(*)::text as row_count
FROM "Candidates"
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Candidates');

-- Check candidates table (lowercase c)
SELECT 'candidates' as table_name, COUNT(*)::text as row_count  
FROM candidates
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'candidates');

-- Check membership_applications
SELECT 'membership_applications' as table_name, COUNT(*)::text as row_count
FROM membership_applications
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'membership_applications');

-- 3. Show columns for membership_applications if it exists
SELECT 'Columns in membership_applications:' as info;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'membership_applications'
ORDER BY ordinal_position;

-- 4. Show actual data from membership_applications
SELECT 'Sample from membership_applications:' as info;
SELECT * FROM membership_applications LIMIT 2;

-- 5. Test with anon role
SELECT 'Testing anon role access:' as info;
SET ROLE anon;
SELECT COUNT(*)::text as anon_can_see FROM membership_applications;
RESET ROLE;

-- 6. Show RLS status
SELECT 'RLS Status:' as info;
SELECT 
    schemaname,
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('Candidates', 'candidates', 'membership_applications');

-- 7. Show policies
SELECT 'RLS Policies:' as info;
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename IN ('Candidates', 'candidates', 'membership_applications');
