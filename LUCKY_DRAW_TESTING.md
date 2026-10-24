# Lucky Draw Testing Guide

## Quick Test Checklist

### ✅ Prerequisites
- [ ] Database table `lucky_draw_entries` created in Supabase
- [ ] RLS policies enabled (run the SQL from `lucky-draw-entries-schema.sql`)
- [ ] Development server running (`npm run dev`)

---

## Test 1: Submit a Lucky Draw Entry

### Steps:
1. Navigate to: http://localhost:8080/lucky-draw
2. Scroll down to the **"ENTER THE DRAW"** section
3. Fill in the form with test data:
   ```
   Full Name: John Doe
   Email: john.doe@example.com
   Phone: 0123456789
   Membership ID: SHOSH001
   ```
4. Click **"Submit Entry"** button
5. Wait for the submission to complete

### Expected Result:
- ✅ Success toast notification appears: "✅ Entry Submitted!"
- ✅ Form fields are cleared automatically
- ✅ No errors in browser console (press F12 to check)

### If It Fails:
- Check browser console for error messages
- Verify Supabase connection
- Ensure the table exists and has correct RLS policies

---

## Test 2: Access Admin Dashboard (Login)

### Steps:
1. Navigate to: http://localhost:8080/admin/lucky-draw
2. You should see a **login screen**
3. Enter admin credentials:
   ```
   Email: excel6963@gmail.com
   Password: Banele@123321
   ```
4. Click **"Login"** button

### Expected Result:
- ✅ Login successful
- ✅ Redirected to admin dashboard
- ✅ "Logout" button appears in top-right corner
- ✅ Dashboard shows entry table

### If It Fails:
- Double-check the email and password (case-sensitive!)
- Clear browser cache and cookies
- Try in incognito/private browsing mode

---

## Test 3: View Entries in Admin Dashboard

### Steps:
1. After logging in (Test 2), you should see the admin dashboard
2. Look for the entry you submitted in Test 1

### Expected Result:
- ✅ Table displays all entries
- ✅ Your test entry (John Doe) appears in the table
- ✅ Entry shows: name, email, phone, membership ID, and submission date
- ✅ Total entries count is displayed at the top
- ✅ Statistics cards show correct data

### If No Entries Appear:
- Click the **"Refresh"** button
- Check if the entry was actually submitted (check Supabase table directly)
- Verify RLS policies allow SELECT operations

---

## Test 4: Search Functionality

### Steps:
1. In the admin dashboard, locate the **search box**
2. Type "John" (or part of the test name)
3. Observe the table

### Expected Result:
- ✅ Table filters to show only matching entries
- ✅ "Filtered: X" count updates
- ✅ Entries update in real-time as you type

### Test Multiple Searches:
- Search by email: type "john.doe"
- Search by phone: type "0123"
- Search by membership ID: type "SHOSH001"

All searches should work correctly.

---

## Test 5: Refresh Button

### Steps:
1. Open a second browser tab/window
2. In the first tab, keep the admin dashboard open
3. In the second tab, go to http://localhost:8080/lucky-draw
4. Submit another entry with different data:
   ```
   Full Name: Jane Smith
   Email: jane.smith@example.com
   Phone: 0987654321
   Membership ID: SHOSH002
   ```
5. Return to the admin dashboard (first tab)
6. Click the **"Refresh"** button

### Expected Result:
- ✅ Button shows "Refreshing..." with spinning icon
- ✅ New entry (Jane Smith) appears in the table
- ✅ Total count increases
- ✅ Button returns to normal after refresh

---

## Test 6: Export to CSV

### Steps:
1. In the admin dashboard, click the **"Export CSV"** button
2. A file download should start

### Expected Result:
- ✅ CSV file downloads automatically
- ✅ Filename format: `lucky-draw-entries-YYYY-MM-DD.csv`
- ✅ Open the CSV file and verify:
  - Headers: Date, Full Name, Email, Phone, Membership ID
  - All entries are included
  - Data is properly formatted

---

## Test 7: Delete Entry

### Steps:
1. In the admin dashboard, locate one of your test entries
2. Click the **red trash icon** (🗑️) in the "Actions" column
3. A confirmation dialog should appear
4. Click **"OK"** to confirm

### Expected Result:
- ✅ Confirmation dialog appears
- ✅ After confirming, the entry disappears from the table
- ✅ Total count decreases
- ✅ No errors appear

### Test Cancel:
1. Try deleting another entry
2. Click **"Cancel"** on the confirmation dialog
3. Entry should remain in the table

---

## Test 8: Logout Functionality

### Steps:
1. In the admin dashboard, locate the **"Logout"** button in the top-right corner
2. Click the **"Logout"** button

### Expected Result:
- ✅ Logged out successfully
- ✅ Redirected to login screen
- ✅ Cannot access dashboard without logging in again

### Verify Session:
1. After logging out, try navigating directly to: http://localhost:8080/admin/lucky-draw
2. You should be forced to log in again

---

## Test 9: Auto-Refresh (30 seconds)

### Steps:
1. Login to admin dashboard
2. Note the current number of entries
3. In another tab/window, submit 2-3 new entries
4. Return to admin dashboard
5. Wait **30 seconds** without refreshing the page

### Expected Result:
- ✅ After ~30 seconds, new entries appear automatically
- ✅ Total count updates automatically
- ✅ No page refresh required

---

## Test 10: Multiple Entries (Stress Test)

### Steps:
1. Submit 5-10 entries with different data
2. Check admin dashboard to ensure all appear
3. Try searching for specific entries
4. Export to CSV and verify all entries are included

### Expected Result:
- ✅ All entries are saved correctly
- ✅ No duplicate entries
- ✅ Search works across all entries
- ✅ CSV export includes all entries

---

## Test 11: Countdown Timer

### Steps:
1. Navigate to: http://localhost:8080/lucky-draw
2. Observe the countdown timer near the top

### Expected Result:
- ✅ Timer shows days, hours, minutes, seconds
- ✅ Timer counts down in real-time
- ✅ Closing date: 4 November 2026
- ✅ Timer updates every second

### Note:
Since the closing date is in the future, the timer should show many days remaining.

---

## Test 12: Responsive Design (Mobile)

### Steps:
1. Open browser developer tools (F12)
2. Enable device toolbar / responsive mode
3. Test on different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1280px)

### Test Both Pages:
- Lucky Draw page: http://localhost:8080/lucky-draw
- Admin dashboard: http://localhost:8080/admin/lucky-draw

### Expected Result:
- ✅ Layout adapts to screen size
- ✅ Form is usable on mobile
- ✅ Table scrolls horizontally on mobile
- ✅ All buttons are accessible
- ✅ Text is readable

---

## Test 13: Form Validation

### Steps:
1. Navigate to: http://localhost:8080/lucky-draw
2. Try submitting the form with:
   - **Empty fields** - should show HTML5 validation
   - **Invalid email** (e.g., "notanemail") - should show validation error
   - **All fields filled** - should submit successfully

### Expected Result:
- ✅ Cannot submit with empty fields
- ✅ Email validation works
- ✅ Valid form submits successfully

---

## Test 14: Browser Console (Error Check)

### Steps:
1. Open browser console (F12 → Console tab)
2. Submit an entry
3. Check for any errors

### Expected Result:
- ✅ No error messages in console
- ✅ Success log: "Entry submitted successfully: [data]"
- ✅ No network errors

### Check Admin Dashboard:
1. Open console in admin dashboard
2. Click "Refresh" button
3. Check console for logs

### Expected Result:
- ✅ Log shows: "Fetched X entries"
- ✅ No errors

---

## Troubleshooting Common Issues

### Issue: "Submission Failed" Error
**Solutions:**
1. Open browser console and check error message
2. Verify Supabase table exists
3. Check RLS policies are enabled
4. Ensure internet connection is active

### Issue: Admin Login Not Working
**Solutions:**
1. Clear browser cache and cookies
2. Verify credentials are correct (case-sensitive!)
3. Try incognito/private browsing mode

### Issue: Entries Not Appearing in Dashboard
**Solutions:**
1. Click "Refresh" button
2. Check Supabase Table Editor to verify data exists
3. Verify RLS SELECT policy is enabled
4. Clear browser cache

### Issue: CSV Export Not Working
**Solutions:**
1. Check if entries exist in the table
2. Verify browser allows file downloads
3. Check Downloads folder

---

## Success Criteria

All tests should pass with ✅. If any test fails, refer to the troubleshooting section or check the setup guide in `LUCKY_DRAW_SETUP.md`.

### Final Checklist:
- [ ] Lucky Draw submission works
- [ ] Admin login works with correct credentials
- [ ] Entries appear in admin dashboard
- [ ] Search/filter functionality works
- [ ] Export to CSV works
- [ ] Delete entries works
- [ ] Logout works
- [ ] Auto-refresh works (30 seconds)
- [ ] Countdown timer works
- [ ] Responsive design works on mobile
- [ ] Form validation works
- [ ] No console errors

---

## Production Deployment Checklist

Before deploying to production:

1. **Database:**
   - [ ] Run `lucky-draw-entries-schema.sql` in production Supabase
   - [ ] Verify RLS policies are enabled
   - [ ] Test a submission in production

2. **Admin Access:**
   - [ ] Update admin credentials in `src/components/AdminAuth.tsx`
   - [ ] Consider using environment variables for security
   - [ ] Test admin login in production

3. **Testing:**
   - [ ] Run all tests above in production environment
   - [ ] Verify CSV export works
   - [ ] Test on multiple devices/browsers

4. **Security:**
   - [ ] Ensure Supabase RLS policies are correct
   - [ ] Verify admin credentials are secure
   - [ ] Test that unauthorized users cannot access admin dashboard

5. **Monitoring:**
   - [ ] Set up error logging
   - [ ] Monitor submission success rate
   - [ ] Track admin dashboard usage

---

## Support

If you encounter issues not covered in this guide:
1. Check `LUCKY_DRAW_SETUP.md` for setup instructions
2. Review `lucky-draw-entries-schema.sql` for database schema
3. Check browser console for detailed error messages
4. Verify Supabase connection and RLS policies
