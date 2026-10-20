-- ============================================================
--  ADD CATEGORY COLUMN TO HOUSING APPLICATIONS
--  Run this if you already have the housing_applications table
--  and need to add the category column
-- ============================================================

-- Add category column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='housing_applications' 
        AND column_name='category'
    ) THEN
        ALTER TABLE public.housing_applications 
        ADD COLUMN category text NOT NULL DEFAULT 'rdp'
        CHECK (category IN ('rdp', 'rental'));
    END IF;
END $$;

-- Done! Category column added successfully.
