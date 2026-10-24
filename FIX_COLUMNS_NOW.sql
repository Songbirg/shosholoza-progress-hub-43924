-- ============================================================
-- RUN THIS NOW IN SUPABASE TO FIX YOUR CANDIDATES
-- https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql
-- ============================================================

-- This will rename your CSV column names to match what the app expects
-- Run ALL of these commands together

DO $$
BEGIN
    -- Rename "Membership #" to membership_number
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'membership_applications' 
        AND column_name = 'Membership #'
    ) THEN
        ALTER TABLE membership_applications 
        RENAME COLUMN "Membership #" TO membership_number;
    END IF;

    -- Rename "Full Name" to full_name
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'membership_applications' 
        AND column_name = 'Full Name'
    ) THEN
        ALTER TABLE membership_applications 
        RENAME COLUMN "Full Name" TO full_name;
    END IF;

    -- Rename "Surname" to surname
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'membership_applications' 
        AND column_name = 'Surname'
    ) THEN
        ALTER TABLE membership_applications 
        RENAME COLUMN "Surname" TO surname;
    END IF;

    -- Rename "Phone" to phone_number
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'membership_applications' 
        AND column_name = 'Phone'
    ) THEN
        ALTER TABLE membership_applications 
        RENAME COLUMN "Phone" TO phone_number;
    END IF;

    -- Rename "Email" to email
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'membership_applications' 
        AND column_name = 'Email'
    ) THEN
        ALTER TABLE membership_applications 
        RENAME COLUMN "Email" TO email;
    END IF;

    -- Rename "Province" to province
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'membership_applications' 
        AND column_name = 'Province'
    ) THEN
        ALTER TABLE membership_applications 
        RENAME COLUMN "Province" TO province;
    END IF;

    -- Rename "City" to city
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'membership_applications' 
        AND column_name = 'City'
    ) THEN
        ALTER TABLE membership_applications 
        RENAME COLUMN "City" TO city;
    END IF;

    -- Rename "Status" to status
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'membership_applications' 
        AND column_name = 'Status'
    ) THEN
        ALTER TABLE membership_applications 
        RENAME COLUMN "Status" TO status;
    END IF;

    -- Rename "Submitted" to created_at if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'membership_applications' 
        AND column_name = 'Submitted'
    ) THEN
        ALTER TABLE membership_applications 
        RENAME COLUMN "Submitted" TO created_at;
    END IF;
END $$;

-- Add missing columns with default values
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS date_of_birth text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS id_number text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS residential_address text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS area_suburb text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS signature_data_url text;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS user_agent text DEFAULT 'CSV Import';

-- Convert created_at to timestamptz if it's text
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'membership_applications' 
        AND column_name = 'created_at'
        AND data_type = 'text'
    ) THEN
        -- Add a temporary column
        ALTER TABLE membership_applications ADD COLUMN created_at_temp timestamptz;
        
        -- Try to parse the dates from the text column
        UPDATE membership_applications 
        SET created_at_temp = to_timestamp(created_at, 'YYYY/MM/DD')
        WHERE created_at ~ '^\d{4}/\d{2}/\d{2}$';
        
        -- For any that didn't match, use current timestamp
        UPDATE membership_applications 
        SET created_at_temp = now()
        WHERE created_at_temp IS NULL;
        
        -- Drop old column and rename new one
        ALTER TABLE membership_applications DROP COLUMN created_at;
        ALTER TABLE membership_applications RENAME COLUMN created_at_temp TO created_at;
    END IF;
END $$;

-- Set default for created_at if not already set
ALTER TABLE membership_applications ALTER COLUMN created_at SET DEFAULT now();

-- Verify the fix
SELECT 
    'SUCCESS! ' || COUNT(*)::text || ' candidates ready to display' as result
FROM membership_applications;

-- Show sample to confirm
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
