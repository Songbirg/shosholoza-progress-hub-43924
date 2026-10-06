import { Handler, HandlerEvent } from "@netlify/functions";
import { getVisits, setVisits } from "./referral-store";

interface ValidateRequest {
  sessionId: string;
  fingerprint: string;
  timeOnPage: number;
}

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
    const sessionVisits = await getVisits(sessionId);
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

    await setVisits(sessionId, sessionVisits);

    const validatedCount = sessionVisits.filter(v => v.validated).length;
    const unlocked = validatedCount >= 10;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        valid: true,
        count: validatedCount,
        unlocked
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
