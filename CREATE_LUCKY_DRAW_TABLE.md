# Create Lucky Draw Table - Quick Setup

## ⚠️ IMPORTANT: Database Table Missing

The error "relation 'public.lucky_draw_entries' does not exist" means you need to create the database table first.

## 🚀 Quick Fix (3 Steps)

### Step 1: Go to Supabase SQL Editor
1. Open: https://supabase.com/dashboard
2. Select your project: **szvovmtjwszfiyfdqqag**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy and Run This SQL

Copy the entire SQL below and paste it into the SQL Editor, then click **Run**:

```sql
-- Create lucky_draw_entries table
CREATE TABLE IF NOT EXISTS public.lucky_draw_entries (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at           timestamptz NOT NULL DEFAULT now(),
  full_name            text NOT NULL,
  email                text NOT NULL,
  phone                text NOT NULL,
  membership_id        text NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lucky_draw_entries_created_at
  ON public.lucky_draw_entries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lucky_draw_entries_email
  ON public.lucky_draw_entries (email);

CREATE INDEX IF NOT EXISTS idx_lucky_draw_entries_membership_id
  ON public.lucky_draw_entries (membership_id);

-- Enable Row Level Security
ALTER TABLE public.lucky_draw_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "anon_insert_lucky_draw" ON public.lucky_draw_entries;
DROP POLICY IF EXISTS "anon_select_lucky_draw" ON public.lucky_draw_entries;
DROP POLICY IF EXISTS "anon_delete_lucky_draw" ON public.lucky_draw_entries;
DROP POLICY IF EXISTS "auth_all_lucky_draw" ON public.lucky_draw_entries;

-- RLS Policies
-- Allow anyone (anon key) to INSERT a new entry
CREATE POLICY "anon_insert_lucky_draw"
  ON public.lucky_draw_entries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to SELECT (admin dashboard uses the anon key)
CREATE POLICY "anon_select_lucky_draw"
  ON public.lucky_draw_entries
  FOR SELECT
  TO anon
  USING (true);

-- Allow anyone (anon key) to DELETE
CREATE POLICY "anon_delete_lucky_draw"
  ON public.lucky_draw_entries
  FOR DELETE
  TO anon
  USING (true);

-- Allow authenticated users full read/write
CREATE POLICY "auth_all_lucky_draw"
  ON public.lucky_draw_entries
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

### Step 3: Verify
After running the SQL, you should see: **"Success. No rows returned"**

## ✅ That's It!

Now refresh your browser page at: http://localhost:8080/admin/applications

The "Lucky Draw" tab should now work without errors!

## 🧪 Test It

1. Go to: http://localhost:8080/lucky-draw
2. Fill in the entry form
3. Submit
4. Go to: http://localhost:8080/admin/applications
5. Click "Lucky Draw" tab
6. Your entry should appear!

## ❌ Still Having Issues?

### If you see "Success" but still get errors:
1. Hard refresh your browser (Ctrl+Shift+R)
2. Clear browser cache
3. Check if you're logged into the correct Supabase project

### If the SQL fails:
- Make sure you're in the correct Supabase project
- Try running each section separately
- Check the error message for details

## 📋 What This Creates

- **Table:** `lucky_draw_entries`
- **Columns:** id, created_at, full_name, email, phone, membership_id
- **Indexes:** For fast searching
- **Security:** RLS policies for public access

---

**Quick Link to SQL Editor:** https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql
