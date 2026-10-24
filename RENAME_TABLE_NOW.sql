-- RENAME YOUR TABLE FROM "Candidates" TO "membership_applications"
-- https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql

-- Rename the table
ALTER TABLE "Candidates" RENAME TO membership_applications;

-- Verify it worked
SELECT 'SUCCESS! Renamed table. Row count: ' || COUNT(*)::text as result
FROM membership_applications;

-- Show sample
SELECT * FROM membership_applications LIMIT 3;
