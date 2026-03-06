import { Handler } from "@netlify/functions";

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-password",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, {});
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  const adminPassword = process.env.ADMIN_PASSWORD;
  const provided =
    event.headers["x-admin-password"] ||
    event.headers["X-Admin-Password"] ||
    event.headers["x-admin-password".toLowerCase()];

  if (!adminPassword) return json(500, { error: "Missing ADMIN_PASSWORD env var" });
  if (!provided || provided !== adminPassword) return json(401, { error: "Unauthorized" });

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return json(500, { error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" });
  }

  try {
    const url = new URL(`${supabaseUrl}/rest/v1/member_applications`);
    url.searchParams.set(
      "select",
      [
        "id",
        "created_at",
        "membership_number",
        "full_name",
        "surname",
        "id_number",
        "phone_number",
        "email",
        "province",
        "city",
      ].join(",")
    );
    url.searchParams.set("order", "created_at.desc");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return json(500, { error: "Failed to fetch applications", details: text });
    }

    const rows = await res.json();
    return json(200, { applications: rows });
  } catch (error) {
    console.error("admin-list-applications error", error);
    return json(500, { error: "Internal server error" });
  }
};
