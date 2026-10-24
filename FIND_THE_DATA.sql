-- FIND WHERE THE DATA ACTUALLY IS
-- https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql

-- Check all schemas for tables with candidate data
SELECT 
    schemaname,
    tablename,
    (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_schema = t.schemaname AND c.table_name = t.tablename) as column_count
FROM pg_tables t
WHERE tablename ILIKE '%candidate%' 
   OR tablename ILIKE '%membership%'
ORDER BY schemaname, tablename;

-- Check the actual Candidates table you showed me
SELECT 'Candidates table (capital C):' as info;
SELECT COUNT(*) as row_count FROM "Candidates";
SELECT * FROM "Candidates" LIMIT 2;

-- Check its schema
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_name = 'Candidates';

-- Check RLS on Candidates table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'Candidates';

-- Disable RLS on the ACTUAL table
ALTER TABLE "Candidates" DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anon
GRANT SELECT, INSERT, UPDATE ON "Candidates" TO anon;
GRANT SELECT, INSERT, UPDATE ON "Candidates" TO authenticated;

-- Test
SET ROLE anon;
SELECT 'Anon can see from Candidates:' as test, COUNT(*)::text FROM "Candidates";
RESET ROLE;
