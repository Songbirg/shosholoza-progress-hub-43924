-- Run this to check what's in your database
-- https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql

-- Check if table exists and see structure
SELECT 
    'Table: ' || table_name as info,
    'Rows: ' || (SELECT COUNT(*)::text FROM membership_applications) as row_count
FROM information_schema.tables 
WHERE table_name = 'membership_applications';

-- Show all columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'membership_applications'
ORDER BY ordinal_position;

-- Show first 5 records with all important fields
SELECT 
    id,
    created_at,
    membership_number,
    full_name,
    surname,
    phone_number,
    email,
    province,
    city,
    status
FROM membership_applications 
LIMIT 5;

-- Count by status
SELECT status, COUNT(*) as count
FROM membership_applications
GROUP BY status;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'membership_applications';

-- Check if RLS is enabled
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'membership_applications';
