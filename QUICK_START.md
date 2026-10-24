# Lucky Draw - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Database (2 minutes)
1. Go to https://supabase.com/dashboard
2. Select your project: **jpafcmixtchvtrkhltst**
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire content from `lucky-draw-entries-schema.sql`
6. Paste and click **Run**
7. ✅ You should see: "Success. No rows returned"

### Step 2: Start Development (1 minute)
```bash
npm run dev
```
Wait for it to start, then open: http://localhost:8080

### Step 3: Test Submission (1 minute)
1. Go to: http://localhost:8080/lucky-draw
2. Scroll to "ENTER THE DRAW"
3. Fill in:
   - Full Name: **Test User**
   - Email: **test@example.com**
   - Phone: **0123456789**
   - Membership ID: **SHOSH001**
4. Click **Submit Entry**
5. ✅ You should see: "✅ Entry Submitted!"

### Step 4: Test Admin Dashboard (1 minute)
1. Go to: http://localhost:8080/admin/lucky-draw
2. Login with:
   - Email: **excel6963@gmail.com**
   - Password: **Banele@123321**
3. ✅ You should see your test entry in the table

---

## 🎉 Done! 

Your Lucky Draw system is now working!

### What You Can Do:

**As a User:**
- Submit lucky draw entries at `/lucky-draw`
- View countdown to closing date
- Learn about the R100,000 prize

**As Admin:**
- View all entries at `/admin/lucky-draw`
- Search and filter entries
- Export to CSV
- Delete entries
- Auto-refresh every 30 seconds

---

## 📚 Need More Help?

- **Setup Issues?** → Read `LUCKY_DRAW_SETUP.md`
- **Want to Test?** → Read `LUCKY_DRAW_TESTING.md`
- **Full Details?** → Read `LUCKY_DRAW_COMPLETE_SUMMARY.md`

---

## ⚠️ Important Notes

1. **Database Required:** You MUST run the SQL schema first (Step 1)
2. **Admin Credentials:** 
   - Email: excel6963@gmail.com
   - Password: Banele@123321
3. **Closing Date:** 4 November 2026
4. **Draw Date:** 12 November 2026

---

## 🆘 Troubleshooting

**Problem:** Submission fails  
**Solution:** Make sure you completed Step 1 (database setup)

**Problem:** Can't login to admin  
**Solution:** Use exact credentials (case-sensitive!)

**Problem:** No entries showing  
**Solution:** Submit a test entry first, then refresh admin dashboard

---

## ✅ Quick Test Checklist

- [ ] Database SQL executed successfully
- [ ] Dev server is running
- [ ] Test entry submitted successfully
- [ ] Admin login works
- [ ] Entry appears in admin dashboard

If all checked ✅, you're all set! 🎉
