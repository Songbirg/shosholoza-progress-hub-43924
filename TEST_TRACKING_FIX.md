# Tracking Fix - Manual Instructions

The tracking system needs the backend API to work properly. Since the Netlify Functions aren't deployed yet, here's what's happening:

## Current Issue
- When someone opens your shared link, the frontend tries to call `/api/track-visit`
- This API doesn't exist yet, so the visit isn't counted
- Your progress stays at 0/10

## Quick Fix Options

### Option 1: Deploy to Netlify (Recommended)
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub: `Songbirg/shosholoza-progress-hub-43924`
4. Deploy - this will deploy both the frontend AND the backend functions
5. The tracking will work automatically

### Option 2: Test Locally with Mock Data
For testing purposes, you can manually increment the counter:

1. Open browser console (F12)
2. Run this code:
```javascript
// Get your session
const session = JSON.parse(localStorage.getItem('shosh_session'));
console.log('Your session ID:', session.sessionId);

// Manually add visits
const visits = {};
visits[session.sessionId] = [
  { fingerprint: 'test1', timestamp: Date.now(), validated: true },
  { fingerprint: 'test2', timestamp: Date.now(), validated: true },
  { fingerprint: 'test3', timestamp: Date.now(), validated: true }
];
localStorage.setItem('all_visits', JSON.stringify(visits));

// Update your session
session.referralCount = 3;
localStorage.setItem('shosh_session', JSON.stringify(session));

// Refresh the page
location.reload();
```

### Option 3: Use a Different Approach
Instead of the complex tracking system, use a simpler approach:
- Remove the 10-referral requirement
- Make membership directly accessible
- Use a different incentive system

## Why This Happened
The viral sharing system requires:
1. **Frontend** (React app) - ✅ Working
2. **Backend** (Netlify Functions) - ❌ Not deployed yet

The backend functions are in `netlify/functions/` but they need to be deployed to Netlify to work.

## Next Steps
**Deploy to Netlify now** and everything will work!

The functions will automatically:
- Track visits
- Validate time-on-page
- Count referrals
- Unlock membership at 10 referrals
