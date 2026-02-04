# Deploy to Netlify - Simple Instructions

Your code is already pushed to GitHub. Now deploy it to Netlify:

## Quick Deploy (5 Minutes)

### Step 1: Go to Netlify
Visit: **https://app.netlify.com/**

### Step 2: Import Project
1. Click **"Add new site"** button
2. Select **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify if prompted

### Step 3: Select Repository
1. Find: **`Songbirg/shosholoza-progress-hub-43924`**
2. Click on it

### Step 4: Configure Build Settings
These should auto-detect from `netlify.toml`:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions`

Click **"Deploy site"**

### Step 5: Wait for Build
- Takes 3-5 minutes
- Watch the deploy log
- Build will compile all TypeScript functions

### Step 6: Your Site is Live!
You'll get a URL like: `https://[random-name].netlify.app`

## What Gets Deployed

✅ **Viral Share Page** at `/`
- WhatsApp sharing system
- R5,000 monthly draw
- Progress tracking

✅ **Membership Form** at `/membership`
- Multi-step registration
- Digital signatures
- PDF downloads

✅ **Backend Functions** (Serverless)
- `/api/track-visit` - Track referrals
- `/api/validate-visit` - Validate visits
- `/api/referral-count` - Get count
- `/api/unlock-status` - Check unlock
- `/api/track-share` - Track shares

✅ **All Pages**
- Home, About, Founder, Values, Contact

## Testing After Deployment

### 1. Test Viral Sharing
- Open your Netlify URL
- Click "Share on WhatsApp"
- Open link in incognito/different device
- Wait 8 seconds
- Check progress updates

### 2. Test Membership Form
- Get 10 referrals (or test with multiple devices)
- Click "Join SHOSH & Enter R5,000 Draw"
- Fill out membership form
- Download PDF

### 3. Check Functions
Open browser DevTools (F12) → Network tab:
- Should see API calls to `/api/track-visit`
- Should see `/api/referral-count` polling
- Check for any errors

## Custom Domain Setup (Optional)

If you have `shosh.org.za`:

1. In Netlify: **Site settings → Domain management**
2. Click **"Add custom domain"**
3. Enter: `shosh.org.za`
4. Update DNS at your registrar:
   - **A Record:** `75.2.60.5`
   - Or **CNAME:** `your-site.netlify.app`
5. Wait for DNS propagation (up to 48 hours)
6. SSL certificate auto-provisions

## Troubleshooting

### Build Fails
- Check deploy log in Netlify
- Look for TypeScript errors
- Verify all dependencies installed

### Functions Not Working
- Check Functions tab in Netlify
- View function logs
- Verify API endpoints in browser

### Sharing Not Tracking
- Check browser console for errors
- Verify localStorage is enabled
- Test in incognito mode

## Continuous Deployment

Now enabled! Every time you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```

Netlify automatically rebuilds and deploys!

## Monitor Your Site

### Netlify Dashboard
- **Deploys:** See build history
- **Functions:** View function logs
- **Analytics:** Enable for $9/month

### Key Metrics to Watch
- Total sessions started
- Active sharing sessions
- Completed sessions (10 referrals)
- Membership signups
- Monthly draw entries

## Support

If deployment fails:
1. Check Netlify deploy log
2. Look for build errors
3. Verify `netlify.toml` configuration
4. Check function syntax

---

**Your site will be live at:** `https://[your-site].netlify.app`

**Repository:** https://github.com/Songbirg/shosholoza-progress-hub-43924

🚀 **Ready to deploy? Follow Step 1 above!**
