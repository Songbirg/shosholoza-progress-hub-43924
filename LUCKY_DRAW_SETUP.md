# Lucky Draw Setup Guide

## Database Setup

### Step 1: Create the Lucky Draw Table

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **szvovmtjwszfiyfdqqag**
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the content from `lucky-draw-entries-schema.sql`
6. Click **Run** to execute the SQL

### Step 2: Verify the Table

1. Navigate to **Table Editor** in the left sidebar
2. You should see a new table called `lucky_draw_entries`
3. The table should have these columns:
   - `id` (uuid, primary key)
   - `created_at` (timestamptz)
   - `full_name` (text)
   - `email` (text)
   - `phone` (text)
   - `membership_id` (text)

### Step 3: Verify RLS Policies

1. Click on the `lucky_draw_entries` table
2. Go to the **Policies** tab at the top
3. You should see these policies:
   - `anon_insert_lucky_draw` - Allows public to insert entries
   - `anon_select_lucky_draw` - Allows public to view entries
   - `anon_delete_lucky_draw` - Allows deleting entries
   - `auth_all_lucky_draw` - Full access for authenticated users

## Admin Access

### Default Admin Credentials

- **Email:** excel6963@gmail.com
- **Password:** Banele@123321

### Accessing the Admin Dashboard

1. Navigate to: http://localhost:8080/admin/lucky-draw (or your production URL)
2. You will see a login screen
3. Enter the admin credentials above
4. Once logged in, you can:
   - View all lucky draw entries
   - Search entries by name, email, phone, or membership ID
   - Export entries to CSV
   - Delete entries
   - View statistics

### Logout

- Click the **Logout** button in the top-right corner to end your session

## Testing the Lucky Draw Submission

### Test the Form

1. Navigate to: http://localhost:8080/lucky-draw
2. Scroll down to the "ENTER THE DRAW" section
3. Fill in the form:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: 0123456789
   - Membership ID: SHOSH123
4. Click **Submit Entry**
5. You should see a success message: "Entry Submitted!"

### Verify in Admin Dashboard

1. Go to: http://localhost:8080/admin/lucky-draw
2. Login with admin credentials
3. You should see your test entry in the table
4. Try the search functionality
5. Try exporting to CSV
6. Try deleting the test entry

## Troubleshooting

### Issue: "Failed to submit entry" error

**Solution:**
1. Check if the `lucky_draw_entries` table exists in Supabase
2. Verify RLS policies are enabled (see Step 3 above)
3. Check browser console for detailed error messages

### Issue: Admin dashboard shows "No entries found"

**Solution:**
1. Submit a test entry from the Lucky Draw page first
2. Refresh the admin dashboard
3. Check if the table has any data in Supabase Table Editor

### Issue: Cannot access admin dashboard

**Solution:**
1. Verify you're using the correct credentials:
   - Email: excel6963@gmail.com
   - Password: Banele@123321
2. Clear your browser cache and try again
3. Check browser console for any errors

### Issue: Entries not appearing immediately

**Solution:**
1. The admin dashboard fetches data on page load
2. Refresh the page to see the latest entries
3. Check your network connection to Supabase

## Features

### Lucky Draw Page
- ✅ Countdown timer to closing date (4 November 2026)
- ✅ Entry form with validation
- ✅ Success/error notifications
- ✅ Responsive design
- ✅ Premium gold/red theme
- ✅ Animated confetti and effects

### Admin Dashboard
- ✅ Secure login with admin credentials
- ✅ View all entries in a table
- ✅ Search/filter entries
- ✅ Export to CSV
- ✅ Delete entries
- ✅ Statistics display
- ✅ Responsive design
- ✅ Session-based authentication

## Production Deployment

When deploying to production:

1. Update admin credentials in `src/components/AdminAuth.tsx`
2. Consider using environment variables for credentials
3. Ensure Supabase URL and keys are correct
4. Test all functionality before launch
5. Set up proper monitoring and error logging

## Database Schema

```sql
Table: lucky_draw_entries
- id: uuid (primary key, auto-generated)
- created_at: timestamptz (auto-generated)
- full_name: text (required)
- email: text (required)
- phone: text (required)
- membership_id: text (required)
```

Indexes:
- `idx_lucky_draw_entries_created_at` - For sorting by date
- `idx_lucky_draw_entries_email` - For email searches
- `idx_lucky_draw_entries_membership_id` - For membership ID searches

## Support

If you encounter any issues:
1. Check this guide first
2. Verify database setup in Supabase
3. Check browser console for errors
4. Review the SQL schema file
5. Contact technical support
