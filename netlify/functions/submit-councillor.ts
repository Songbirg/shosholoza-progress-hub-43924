import { Handler } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

type CouncillorPayload = {
  name: string;
  email: string;
  phone: string;
  municipality: string;
  userAgent?: string;
};

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

const sendViaResend = async (args: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    throw new Error("Missing RESEND_API_KEY or RESEND_FROM env var");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [args.to],
      subject: args.subject,
      html: args.html,
      text: args.text,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Resend API call failed");
  }
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, {});
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const payload: CouncillorPayload = JSON.parse(event.body || "{}");

    if (!payload?.name?.trim()) return json(400, { error: "name is required" });
    if (!payload?.email?.trim()) return json(400, { error: "email is required" });
    if (!payload?.phone?.trim()) return json(400, { error: "phone is required" });
    if (!payload?.municipality?.trim()) return json(400, { error: "municipality is required" });

    const store = getStore("councillor-applications");
    const key = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const record = {
      id: key,
      created_at: new Date().toISOString(),
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      municipality: payload.municipality,
      user_agent: payload.userAgent || null,
    };

    await store.setJSON(key, record);

    let emailSent = false;
    let emailError: string | null = null;

    try {
      const html = `
        <h2>New Councillor Application</h2>
        <p><strong>Name:</strong> ${record.name}</p>
        <p><strong>Email:</strong> ${record.email}</p>
        <p><strong>Phone:</strong> ${record.phone}</p>
        <p><strong>Preferred Municipality:</strong> ${record.municipality}</p>
        <p><strong>Submitted:</strong> ${new Date(record.created_at).toLocaleString("en-ZA")}</p>
      `;

      await sendViaResend({
        to: "info@shosh.org.za",
        subject: `New Councillor Application - ${record.name}`,
        html,
      });
      emailSent = true;
    } catch (e) {
      emailError = e instanceof Error ? e.message : String(e);
      console.error("submit-councillor email error", emailError);
    }

    return json(200, { success: true, id: key, emailSent, emailError });
  } catch (error) {
    console.error("submit-councillor error", error);
    return json(500, { error: "Internal server error" });
  }
};
