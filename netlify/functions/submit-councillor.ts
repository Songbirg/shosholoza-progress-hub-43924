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

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, {});
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const payload: CouncillorPayload = JSON.parse(event.body || "{}");

    if (!payload?.name?.trim()) return json(400, { error: "name is required" });
    if (!payload?.email?.trim()) return json(400, { error: "email is required" });
    if (!payload?.phone?.trim()) return json(400, { error: "phone is required" });
    if (!payload?.municipality?.trim()) return json(400, { error: "municipality is required" });
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

    let stored = false;
    let storeError: string | null = null;

    try {
      const store = getStore("councillor-applications");
      await store.setJSON(key, record);
      stored = true;
    } catch (e) {
      storeError = e instanceof Error ? e.message : String(e);
      console.error("submit-councillor store error", storeError);
    }

    return json(200, { success: true, id: key, stored, storeError });
  } catch (error) {
    console.error("submit-councillor error", error);
    const detail = error instanceof Error ? error.message : String(error);
    return json(500, { error: "Internal server error", detail });
  }
};
