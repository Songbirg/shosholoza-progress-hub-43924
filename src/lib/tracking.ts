
type SessionData = {
  sessionId: string;
  createdAt: number;
};

const SESSION_KEY = "shosh_session";
const VISITOR_KEY = "shosh_visitor";
const REF_TRACKED_KEY = "shosh_ref_tracked";
const MIN_TIME_ON_PAGE = 8000;

const safeJsonParse = <T,>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const generateSessionId = (): string => {
  const rand = Math.random().toString(36).slice(2, 10);
  return `shosh_${Date.now()}_${rand}`;
};

const getOrCreateVisitorId = (): string => {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(VISITOR_KEY, id);
  return id;
};

export const getOrCreateSession = (): SessionData => {
  const stored = safeJsonParse<SessionData>(localStorage.getItem(SESSION_KEY));
  if (stored?.sessionId) return stored;

  const session: SessionData = {
    sessionId: generateSessionId(),
    createdAt: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

const getReferralFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (!ref) return null;
  return ref.trim() || null;
};

export const generateFingerprint = async (): Promise<string> => {
  const visitorId = getOrCreateVisitorId();
  const ua = navigator.userAgent;
  const lang = navigator.language;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const screenStr = `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}x${window.devicePixelRatio ?? 1}`;

  const raw = [visitorId, ua, lang, tz, screenStr].join("|");
  const data = new TextEncoder().encode(raw);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const postJson = async <T,>(url: string, body: unknown): Promise<T> => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
};

const getJson = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
};

export const trackShare = async (): Promise<void> => {
  const { sessionId } = getOrCreateSession();
  await postJson("/.netlify/functions/track-share", {
    sessionId,
    timestamp: Date.now(),
  });
};

export const getWhatsAppShareLink = (): string => {
  const { sessionId } = getOrCreateSession();
  const baseUrl = window.location.origin;
  const referralUrl = `${baseUrl}/?ref=${encodeURIComponent(sessionId)}`;

  const text = `🔥 WIN R5,000 CASH EVERY MONTH!\n\nSHOSH is giving members a chance to win R5,000 monthly.\n\nOpen this link: ${referralUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

const trackVisit = async (refSessionId: string): Promise<{ counted?: boolean } | null> => {
  const fingerprint = await generateFingerprint();
  const userAgent = navigator.userAgent;
  return await postJson("/.netlify/functions/track-visit", {
    sessionId: refSessionId,
    timestamp: Date.now(),
    fingerprint,
    userAgent,
    timeOnPage: 0,
  });
};

const validateVisit = async (refSessionId: string, timeOnPage: number): Promise<void> => {
  const fingerprint = await generateFingerprint();
  await postJson("/.netlify/functions/validate-visit", {
    sessionId: refSessionId,
    fingerprint,
    timeOnPage,
  });
};

export const initializeTracking = async (): Promise<void> => {
  const refSessionId = getReferralFromUrl() ?? "direct";
  const ownSessionId = getOrCreateSession().sessionId;

  if (!refSessionId || refSessionId === "direct" || refSessionId === ownSessionId) return;

  const tracked = safeJsonParse<Record<string, true>>(localStorage.getItem(REF_TRACKED_KEY)) || {};
  if (tracked[refSessionId]) return;

  const start = Date.now();
  const trackRes = await trackVisit(refSessionId);
  const counted = !!(trackRes && (trackRes as any).counted !== false);

  if (!counted) {
    tracked[refSessionId] = true;
    localStorage.setItem(REF_TRACKED_KEY, JSON.stringify(tracked));
    return;
  }

  window.setTimeout(async () => {
    try {
      const timeOnPage = Date.now() - start;
      await validateVisit(refSessionId, timeOnPage);
      tracked[refSessionId] = true;
      localStorage.setItem(REF_TRACKED_KEY, JSON.stringify(tracked));
    } catch {
    }
  }, MIN_TIME_ON_PAGE);
};

export const getReferralCount = async (): Promise<number> => {
  const { sessionId } = getOrCreateSession();
  const data = await getJson<{ count?: number }>(`/.netlify/functions/referral-count/${encodeURIComponent(sessionId)}`);
  return data.count ?? 0;
};

export const checkUnlockStatus = async (): Promise<boolean> => {
  const { sessionId } = getOrCreateSession();
  const data = await getJson<{ unlocked?: boolean }>(`/.netlify/functions/unlock-status/${encodeURIComponent(sessionId)}`);
  return !!data.unlocked;
};

export const getReferralCountForSession = async (sessionId: string): Promise<number> => {
  const trimmed = sessionId.trim();
  if (!trimmed) return 0;
  const data = await getJson<{ count?: number }>(
    `/.netlify/functions/referral-count/${encodeURIComponent(trimmed)}`
  );
  return data.count ?? 0;
};

export const checkUnlockStatusForSession = async (sessionId: string): Promise<boolean> => {
  const trimmed = sessionId.trim();
  if (!trimmed) return false;
  const data = await getJson<{ unlocked?: boolean }>(
    `/.netlify/functions/unlock-status/${encodeURIComponent(trimmed)}`
  );
  return !!data.unlocked;
};

