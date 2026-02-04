import { Handler, HandlerEvent } from "@netlify/functions";

interface VisitData {
  sessionId: string;
  timestamp: number;
  fingerprint: string;
  userAgent: string;
  timeOnPage: number;
}

interface StoredVisit extends VisitData {
  ipHash: string;
  validated: boolean;
}

// In-memory storage (replace with database in production)
const visits: Map<string, StoredVisit[]> = new Map();
const sessionStats: Map<string, { count: number; unlocked: boolean }> = new Map();

// Hash IP address for privacy
const hashIP = (ip: string): string => {
  return Buffer.from(ip).toString('base64').substr(0, 16);
};

// Check if visit is duplicate
const isDuplicateVisit = (sessionId: string, fingerprint: string, ipHash: string): boolean => {
  const sessionVisits = visits.get(sessionId) || [];
  
  // Check for same fingerprint
  const fingerprintMatch = sessionVisits.some(v => v.fingerprint === fingerprint);
  if (fingerprintMatch) return true;
  
  // Check for same IP within 1 hour
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  const recentIPMatch = sessionVisits.some(
    v => v.ipHash === ipHash && v.timestamp > oneHourAgo
  );
  
  return recentIPMatch;
};

export const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const visitData: VisitData = JSON.parse(event.body || '{}');
    const { sessionId, fingerprint, userAgent } = visitData;

    if (!sessionId || sessionId === 'direct') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Direct visit' }),
      };
    }

    // Get IP address
    const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    const ipHash = hashIP(ip);

    // Check for duplicates
    if (isDuplicateVisit(sessionId, fingerprint, ipHash)) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Duplicate visit',
          counted: false 
        }),
      };
    }

    // Store visit
    const storedVisit: StoredVisit = {
      ...visitData,
      ipHash,
      validated: false,
    };

    const sessionVisits = visits.get(sessionId) || [];
    sessionVisits.push(storedVisit);
    visits.set(sessionId, sessionVisits);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Visit tracked',
        counted: true
      }),
    };
  } catch (error) {
    console.error('Error tracking visit:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
