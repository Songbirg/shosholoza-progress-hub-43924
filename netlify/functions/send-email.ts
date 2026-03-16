import { Handler } from "@netlify/functions";

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, {});
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const { to, subject, html, text } = JSON.parse(event.body || "{}");

    if (!to || !subject || (!html && !text)) {
      return json(400, { error: "Missing required fields: to, subject, html/text" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM || "info@shosh.org.za";

    if (!apiKey) {
      return json(503, { error: "Email service not configured" });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return json(502, { error: "Email service error", detail: errorText });
    }

    return json(200, { sent: true });
  } catch (error) {
    console.error("send-email error", error);
    const detail = error instanceof Error ? error.message : String(error);
    return json(500, { error: "Internal server error", detail });
  }
};
