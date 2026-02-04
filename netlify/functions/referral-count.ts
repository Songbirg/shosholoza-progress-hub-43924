import { Handler, HandlerEvent } from "@netlify/functions";

// Shared storage
const visits: Map<string, any[]> = new Map();
const sessionStats: Map<string, { count: number; unlocked: boolean }> = new Map();

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

    // Get or create stats
    const stats = sessionStats.get(sessionId) || { count: validatedCount, unlocked: false };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        count: validatedCount,
        unlocked: stats.unlocked
      }),
    };
  } catch (error) {
    console.error('Error getting referral count:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
