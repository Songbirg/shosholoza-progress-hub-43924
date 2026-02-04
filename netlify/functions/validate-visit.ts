import { Handler, HandlerEvent } from "@netlify/functions";

interface ValidateRequest {
  sessionId: string;
  fingerprint: string;
  timeOnPage: number;
}

// Shared storage (in production, use a database)
const visits: Map<string, any[]> = new Map();
const sessionStats: Map<string, { count: number; unlocked: boolean }> = new Map();

const MIN_TIME_ON_PAGE = 8000; // 8 seconds

export const handler: Handler = async (event: HandlerEvent) => {
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
    const { sessionId, fingerprint, timeOnPage }: ValidateRequest = JSON.parse(event.body || '{}');

    // Check minimum time requirement
    if (timeOnPage < MIN_TIME_ON_PAGE) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          valid: false,
          reason: 'Insufficient time on page'
        }),
      };
    }

    // Find and validate the visit
    const sessionVisits = visits.get(sessionId) || [];
    const visit = sessionVisits.find(v => v.fingerprint === fingerprint && !v.validated);

    if (!visit) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          valid: false,
          reason: 'Visit not found or already validated'
        }),
      };
    }

    // Mark as validated
    visit.validated = true;
    visit.timeOnPage = timeOnPage;

    // Update session stats
    const stats = sessionStats.get(sessionId) || { count: 0, unlocked: false };
    const validatedCount = sessionVisits.filter(v => v.validated).length;
    stats.count = validatedCount;
    
    // Check if unlocked (10 validated visits)
    if (validatedCount >= 10 && !stats.unlocked) {
      stats.unlocked = true;
    }
    
    sessionStats.set(sessionId, stats);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        valid: true,
        count: validatedCount,
        unlocked: stats.unlocked
      }),
    };
  } catch (error) {
    console.error('Error validating visit:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
