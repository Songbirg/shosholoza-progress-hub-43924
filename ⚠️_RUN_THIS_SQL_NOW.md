# ⚠️ URGENT: RUN THIS SQL IN SUPABASE NOW

## The Lucky Draw tab shows an error because the database table doesn't exist yet.

---

## 🚀 3 STEPS TO FIX (Takes 2 minutes)

### STEP 1: Open Supabase SQL Editor
Click this link: https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql

(Or manually go to: Supabase Dashboard → Your Project → SQL Editor)

---

### STEP 2: Copy and Run This SQL

**Click "New Query" then copy-paste this entire SQL block:**

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lucky_draw_entries_created_at
  ON public.lucky_draw_entries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lucky_draw_entries_email
  ON public.lucky_draw_entries (email);

CREATE INDEX IF NOT EXISTS idx_lucky_draw_entries_membership_id
  ON public.lucky_draw_entries (membership_id);

-- Enable RLS
ALTER TABLE public.lucky_draw_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "anon_insert_lucky_draw" ON public.lucky_draw_entries;
DROP POLICY IF EXISTS "anon_select_lucky_draw" ON public.lucky_draw_entries;
DROP POLICY IF EXISTS "anon_delete_lucky_draw" ON public.lucky_draw_entries;
DROP POLICY IF EXISTS "auth_all_lucky_draw" ON public.lucky_draw_entries;

-- Create RLS policies
CREATE POLICY "anon_insert_lucky_draw"
  ON public.lucky_draw_entries FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_lucky_draw"
  ON public.lucky_draw_entries FOR SELECT TO anon USING (true);

CREATE POLICY "anon_delete_lucky_draw"
  ON public.lucky_draw_entries FOR DELETE TO anon USING (true);

CREATE POLICY "auth_all_lucky_draw"
  ON public.lucky_draw_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

**Then click the "Run" button (or press Ctrl+Enter)**

---

### STEP 3: Refresh Browser
1. After you see "Success" in Supabase
2. Go back to: http://localhost:8080/admin/applications
3. Press F5 or Ctrl+R to refresh
4. Click "Lucky Draw" tab
5. The error will be gone! ✅

---

## ✅ Expected Result

After running the SQL, you should see:
- ✅ "Success. No rows returned" in Supabase
- ✅ Lucky Draw tab loads without errors
- ✅ Statistics show: Total Entries: 0
- ✅ Empty state message: "No lucky draw entries yet."

---

## 🧪 Test It Works

After fixing the error:

1. Go to: http://localhost:8080/lucky-draw
2. Fill in the form:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: 0123456789
   - Membership ID: TEST001
3. Click "Submit Entry"
4. Go to: http://localhost:8080/admin/applications
5. Click "Lucky Draw" tab
6. Your test entry should appear! 🎉

---

## 🆘 Troubleshooting

### If SQL fails:
- Make sure you're in the correct project: **szvovmtjwszfiyfdqqag**
- Check you have admin permissions
- Try running sections one at a time

### If error persists after SQL:
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Check browser console for other errors

---

## 📋 What This Creates

**Table:** `public.lucky_draw_entries`

**Columns:**
- `id` (uuid) - Unique entry ID
- `created_at` (timestamptz) - Submission date/time
- `full_name` (text) - Participant's full name
- `email` (text) - Email address
- `phone` (text) - Phone number
- `membership_id` (text) - SHOSH membership ID

**Security:**
- Public can INSERT (submit entries)
- Public can SELECT (view in admin)
- Public can DELETE (admin can remove)
- Authenticated users have full access

---

## 🎯 That's It!

Once you run the SQL in Supabase, everything will work perfectly!

**Direct link to SQL Editor:**
https://supabase.com/dashboard/project/szvovmtjwszfiyfdqqag/sql

---

**Status:** ⏳ Waiting for you to run the SQL in Supabase
**Time to fix:** Less than 2 minutes
**Difficulty:** Copy + Paste + Click Run
