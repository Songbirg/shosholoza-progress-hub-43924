// Tracking Service for Viral Sharing System

export interface SessionData {
  sessionId: string;
  createdAt: number;
  referralCount: number;
  isUnlocked: boolean;
  lastActivityAt: number;
  fingerprint: string;
}

export interface VisitData {
  sessionId: string;
  timestamp: number;
  fingerprint: string;
  ipHash?: string;
  userAgent: string;
  timeOnPage: number;
}

// Generate unique session ID
export const generateSessionId = (): string => {
  return `shosh_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

// Generate device fingerprint
export const generateFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvasData: canvas.toDataURL(),
  };
  
  return btoa(JSON.stringify(fingerprint)).substring(0, 32);
};

// Get or create session
export const getOrCreateSession = (): SessionData => {
  const stored = localStorage.getItem('shosh_session');
  
  if (stored) {
    try {
      const session: SessionData = JSON.parse(stored);
      if (Date.now() - session.createdAt < 30 * 24 * 60 * 60 * 1000) {
        return session;
      }
    } catch (e) {
      console.error('Invalid session data');
    }
  }
  
  const newSession: SessionData = {
    sessionId: generateSessionId(),
    createdAt: Date.now(),
    referralCount: 0,
    isUnlocked: false,
    lastActivityAt: Date.now(),
    fingerprint: generateFingerprint(),
  };
  
  localStorage.setItem('shosh_session', JSON.stringify(newSession));
  return newSession;
};

// Update session
export const updateSession = (updates: Partial<SessionData>): SessionData => {
  const session = getOrCreateSession();
  const updated = {
    ...session,
    ...updates,
    lastActivityAt: Date.now(),
  };
  
  localStorage.setItem('shosh_session', JSON.stringify(updated));
  return updated;
};

// Check if user is first-time visitor
export const isFirstTimeVisitor = (): boolean => {
  const visited = localStorage.getItem('shosh_visited');
  if (!visited) {
    localStorage.setItem('shosh_visited', Date.now().toString());
    return true;
  }
  return false;
};

// Track visit
export const trackVisit = async (referrerSessionId?: string): Promise<void> => {
  const fingerprint = generateFingerprint();
  const isFirstTime = isFirstTimeVisitor();
  
  if (!isFirstTime) {
    console.log('Returning visitor - not counted');
    return;
  }
  
  const visitData: VisitData = {
    sessionId: referrerSessionId || 'direct',
    timestamp: Date.now(),
    fingerprint,
    userAgent: navigator.userAgent,
    timeOnPage: 0,
  };
  
  sessionStorage.setItem('visit_start', Date.now().toString());
  
  try {
    await fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitData),
    });
  } catch (error) {
    console.error('Failed to track visit:', error);
  }
};

// Validate visit
export const validateVisit = async (referrerSessionId: string): Promise<boolean> => {
  const visitStart = sessionStorage.getItem('visit_start');
  if (!visitStart) return false;
  
  const timeOnPage = Date.now() - parseInt(visitStart);
  const MIN_TIME = 8000;
  
  if (timeOnPage < MIN_TIME) {
    console.log('Visit too short - not validated');
    return false;
  }
  
  try {
    const response = await fetch('/api/validate-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: referrerSessionId,
        fingerprint: generateFingerprint(),
        timeOnPage,
      }),
    });
    
    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error('Failed to validate visit:', error);
    return false;
  }
};

// Get referral count
export const getReferralCount = async (): Promise<number> => {
  const session = getOrCreateSession();
  
  try {
    const response = await fetch(`/api/referral-count/${session.sessionId}`);
    const data = await response.json();
    updateSession({ referralCount: data.count });
    return data.count;
  } catch (error) {
    console.error('Failed to get referral count:', error);
    return session.referralCount;
  }
};

// Check unlock status
export const checkUnlockStatus = async (): Promise<boolean> => {
  const session = getOrCreateSession();
  
  if (session.isUnlocked) return true;
  
  try {
    const response = await fetch(`/api/unlock-status/${session.sessionId}`);
    const data = await response.json();
    
    if (data.unlocked) {
      updateSession({ isUnlocked: true, referralCount: data.count });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to check unlock status:', error);
    return false;
  }
};

// Get share URL
export const getShareUrl = (): string => {
  const session = getOrCreateSession();
  const baseUrl = window.location.origin;
  return `${baseUrl}/?ref=${session.sessionId}`;
};

// Get WhatsApp message
export const getWhatsAppMessage = (): string => {
  const shareUrl = getShareUrl();
  return ` WIN R5,000 CASH EVERY MONTH!

SHOSH is giving members a chance to win R5,000 monthly.

Share this link with 10 friends and join: ${shareUrl}`;
};

// Get WhatsApp share link
export const getWhatsAppShareLink = (): string => {
  const message = encodeURIComponent(getWhatsAppMessage());
  return `https://wa.me/?text=${message}`;
};

// Track share
export const trackShare = async (): Promise<void> => {
  const session = getOrCreateSession();
  
  try {
    await fetch('/api/track-share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.sessionId,
        timestamp: Date.now(),
      }),
    });
  } catch (error) {
    console.error('Failed to track share:', error);
  }
};

// Get referrer from URL
export const getReferrerFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
};

// Initialize tracking
export const initializeTracking = async (): Promise<void> => {
  const referrerId = getReferrerFromUrl();
  
  if (referrerId) {
    await trackVisit(referrerId);
    setTimeout(async () => {
      await validateVisit(referrerId);
    }, 8000);
  }
  
  getOrCreateSession();
};

// Export session data
export const exportSessionData = (): SessionData => {
  return getOrCreateSession();
};
