import { Handler } from "@netlify/functions";

type ApplicationPayload = {
  membershipNumber: string;
  formData: {
    fullName: string;
    surname: string;
    dateOfBirth: string;
    idNumber: string;
    phoneNumber: string;
    email?: string;
    residentialAddress: string;
    province: string;
    city: string;
    areaSuburb: string;
  };
  signatureDataUrl: string;
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

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return json(500, { error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" });
  }

  try {
    const payload: ApplicationPayload = JSON.parse(event.body || "{}");

    if (!payload?.membershipNumber) return json(400, { error: "membershipNumber is required" });
    if (!payload?.formData) return json(400, { error: "formData is required" });
    if (!payload?.signatureDataUrl) return json(400, { error: "signatureDataUrl is required" });

    const row = {
      membership_number: payload.membershipNumber,
      full_name: payload.formData.fullName,
      surname: payload.formData.surname,
      date_of_birth: payload.formData.dateOfBirth,
      id_number: payload.formData.idNumber,
      phone_number: payload.formData.phoneNumber,
      email: payload.formData.email || null,
      residential_address: payload.formData.residentialAddress,
      province: payload.formData.province,
      city: payload.formData.city,
      area_suburb: payload.formData.areaSuburb,
      signature_data_url: payload.signatureDataUrl,
      user_agent: payload.userAgent || null,
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/member_applications`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const text = await res.text();
      return json(500, { error: "Failed to insert application", details: text });
    }

    const created = await res.json();
    return json(200, { success: true, application: created?.[0] ?? null });
  } catch (error) {
    console.error("submit-application error", error);
    return json(500, { error: "Internal server error" });
  }
};
