import { Handler, HandlerEvent } from "@netlify/functions";

interface ShareData {
  sessionId: string;
  timestamp: number;
}

// Storage for share tracking
const shares: Map<string, ShareData[]> = new Map();

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
    const shareData: ShareData = JSON.parse(event.body || '{}');
    const { sessionId, timestamp } = shareData;

    if (!sessionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Session ID required' }),
      };
    }

    // Store share event
    const sessionShares = shares.get(sessionId) || [];
    sessionShares.push({ sessionId, timestamp });
    shares.set(sessionId, sessionShares);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        shareCount: sessionShares.length
      }),
    };
  } catch (error) {
    console.error('Error tracking share:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
