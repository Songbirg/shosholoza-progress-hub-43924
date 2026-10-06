# WhatsApp Viral Sharing System

## Overview

A viral sharing system that incentivizes users to share https://shosh.org.za/ with 10 friends on WhatsApp to unlock SHOSH membership and enter a monthly R5,000 cash draw.

## How It Works

### User Flow

1. **User opens https://shosh.org.za/**
   - Sees viral share page with R5,000 cash prize CTA
   - Progress bar shows 0/10 referrals

2. **User shares on WhatsApp**
   - Clicks "Share on WhatsApp" button
   - Pre-filled message opens in WhatsApp
   - Message includes unique tracking link

3. **Friends open the link**
   - Each unique visitor is tracked
   - Progress updates in real-time
   - Only counts: new IPs, new devices, first-time visitors

4. **Unlock at 10 referrals**
   - Membership link unlocks
   - User can join SHOSH
   - Automatically entered into monthly R5,000 draw

## Technical Implementation

### Frontend (`src/pages/ViralShare.tsx`)

- **Main viral share page** at `/`
- Real-time progress tracking
- WhatsApp share integration
- Unlock status display
- Confetti animation on unlock

### Tracking Service (`src/lib/tracking.ts`)

**Key Functions:**
- `generateSessionId()` - Creates unique session ID
- `generateFingerprint()` - Device fingerprinting
- `trackVisit()` - Records new visits
- `validateVisit()` - Validates after 8 seconds
- `getReferralCount()` - Gets current count
- `checkUnlockStatus()` - Checks if unlocked
- `getWhatsAppShareLink()` - Generates share link

**Anti-Cheat Measures:**
- Device fingerprinting (canvas, user agent, screen, timezone)
- IP address hashing
- Minimum 8 seconds time-on-page
- Duplicate detection (same IP within 1 hour)
- First-time visitor validation

### Backend API (Netlify Functions)

Located in `netlify/functions/`:

1. **track-visit.ts**
   - Records new visits
   - Checks for duplicates
   - Hashes IP addresses

2. **validate-visit.ts**
   - Validates time-on-page (8+ seconds)
   - Marks visits as validated
   - Updates referral count

3. **referral-count.ts**
   - Returns validated referral count
   - GET `/api/referral-count/{sessionId}`

4. **unlock-status.ts**
   - Checks if 10 referrals reached
   - Returns unlock status
   - GET `/api/unlock-status/{sessionId}`

5. **track-share.ts**
   - Tracks share button clicks
   - POST `/api/track-share`

## Data Flow

```
User A shares link
    ↓
User B opens link with ?ref=sessionA
    ↓
Frontend calls trackVisit(sessionA)
    ↓
Backend stores visit (IP hash, fingerprint)
    ↓
After 8 seconds, validateVisit(sessionA)
    ↓
Backend validates and increments count
    ↓
User A's progress updates (1/10)
    ↓
Repeat until 10 validated visits
    ↓
Unlock membership access
```

## Storage

### Current Implementation (In-Memory)
- Visits stored in Map
- Session stats in Map
- **Note:** Resets on server restart

### Production Recommendation
Replace with database:
- **MongoDB** - Document store for sessions/visits
- **PostgreSQL** - Relational database
- **Redis** - Fast caching layer
- **Supabase** - Serverless database

## URL Structure

- **Main page:** `https://shosh.org.za/`
- **With referral:** `https://shosh.org.za/?ref=shosh_1234567890_abc123`
- **Membership:** `https://shosh.org.za/membership`
- **Original home:** `https://shosh.org.za/home`

## WhatsApp Message Template

```
🔥 WIN R5,000 CASH EVERY MONTH! 

SHOSH is giving members a chance to win R5,000 monthly. 

Share this link with 10 friends and join: https://shosh.org.za/?ref=SESSION_ID
```

## Anti-Cheat Features

### Device Fingerprinting
- Canvas fingerprinting
- User agent
- Screen resolution
- Timezone
- Platform
- Language

### IP Tracking
- Hashed for privacy
- Blocks same IP within 1 hour
- Prevents rapid refreshes

### Time Validation
- Minimum 8 seconds on page
- Prevents bot visits
- Ensures genuine interest

### Duplicate Detection
- Same fingerprint blocked
- Same IP within timeframe blocked
- Already validated visits ignored

## Configuration

### Adjustable Parameters

In `src/lib/tracking.ts`:
```typescript
const MIN_TIME = 8000; // Minimum time on page (ms)
```

In `src/pages/ViralShare.tsx`:
```typescript
const REQUIRED_REFERRALS = 10; // Referrals needed
const PRIZE_AMOUNT = "R5,000"; // Prize amount
```

In backend functions:
```typescript
const MIN_TIME_ON_PAGE = 8000; // 8 seconds
const REQUIRED_REFERRALS = 10;
```

## Deployment

### Netlify Setup

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

2. **Environment Variables** (if using database)
   ```
   DATABASE_URL=your_database_url
   REDIS_URL=your_redis_url
   ```

3. **Deploy**
   ```bash
   git push origin main
   ```
   Netlify auto-deploys on push

### Testing

1. **Local Development**
   ```bash
   npm run dev
   ```
   Visit http://localhost:8080

2. **Test Sharing**
   - Open in browser
   - Click "Share on WhatsApp"
   - Open link in incognito/different device
   - Wait 8 seconds
   - Check progress updates

3. **Test Unlock**
   - Simulate 10 unique visits
   - Verify unlock message
   - Check membership link appears

## Monitoring

### Key Metrics to Track

1. **Total Sessions Started**
   - How many people initiated sharing

2. **Active Sharing Sessions**
   - Currently in progress (0-9 referrals)

3. **Completed Sessions**
   - Reached 10 referrals

4. **Conversion Rate**
   - % of sessions that complete

5. **Average Time to Complete**
   - How long to get 10 referrals

6. **Membership Signups**
   - How many unlocked users join

7. **Monthly Draw Entries**
   - Total eligible for prize

## Admin Dashboard (To Be Built)

Recommended features:

```typescript
interface AdminDashboard {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  membershipJoins: number;
  drawEntries: number;
  
  sessions: {
    sessionId: string;
    referralCount: number;
    status: 'locked' | 'unlocked';
    createdAt: Date;
    unlockedAt?: Date;
    ipSummary: string[];
    deviceSummary: string[];
  }[];
}
```

## Security Considerations

1. **Privacy**
   - IP addresses are hashed
   - No personal data stored without consent
   - GDPR compliant

2. **Rate Limiting**
   - Prevent API abuse
   - Limit requests per IP
   - Throttle validation checks

3. **Data Retention**
   - Clear old sessions (30 days)
   - Archive completed sessions
   - GDPR right to deletion

## Future Enhancements

1. **Database Integration**
   - Persistent storage
   - Better analytics
   - Historical data

2. **Admin Dashboard**
   - Real-time monitoring
   - Session management
   - Draw winner selection

3. **Email Notifications**
   - Progress updates
   - Unlock notifications
   - Draw winner announcements

4. **Social Proof**
   - "X people joined today"
   - "Y people won this month"
   - Testimonials

5. **Gamification**
   - Leaderboards
   - Badges
   - Bonus entries for more referrals

6. **Multi-Channel Sharing**
   - Facebook
   - Twitter
   - Email
   - SMS

## Troubleshooting

### Progress Not Updating
- Check browser console for errors
- Verify API endpoints are accessible
- Check localStorage for session data
- Ensure 8 seconds elapsed

### Visits Not Counting
- Check if duplicate (same IP/device)
- Verify minimum time requirement
- Check fingerprint generation
- Review backend logs

### Unlock Not Working
- Verify 10 validated visits
- Check unlock status API
- Clear localStorage and retry
- Check backend session stats

## Support

For issues or questions:
- Check browser console logs
- Review Netlify function logs
- Test in incognito mode
- Verify API responses

## License

Proprietary - Shosholoza Progressive Party
