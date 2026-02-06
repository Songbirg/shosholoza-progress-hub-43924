import { Handler, HandlerEvent } from "@netlify/functions";
import { getValidatedCount } from "./referral-store";

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

    const validatedCount = await getValidatedCount(sessionId);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        count: validatedCount,
        unlocked: validatedCount >= 10
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
