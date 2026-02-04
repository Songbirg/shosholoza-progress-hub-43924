import { Handler, HandlerEvent } from "@netlify/functions";

// Shared storage
const visits: Map<string, any[]> = new Map();
const sessionStats: Map<string, { count: number; unlocked: boolean }> = new Map();

const REQUIRED_REFERRALS = 10;

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const sessionId = event.path.split('/').pop();

    if (!sessionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Session ID required' }),
      };
    }

    // Get validated visit count
    const sessionVisits = visits.get(sessionId) || [];
    const validatedCount = sessionVisits.filter(v => v.validated).length;

    // Check unlock status
    const stats = sessionStats.get(sessionId) || { count: validatedCount, unlocked: false };
    const unlocked = validatedCount >= REQUIRED_REFERRALS;
    
    if (unlocked && !stats.unlocked) {
      stats.unlocked = true;
      sessionStats.set(sessionId, stats);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        unlocked,
        count: validatedCount,
        required: REQUIRED_REFERRALS
      }),
    };
  } catch (error) {
    console.error('Error checking unlock status:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
