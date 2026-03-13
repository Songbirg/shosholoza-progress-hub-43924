import { Handler } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

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
    const payload: ApplicationPayload = JSON.parse(event.body || "{}");

    if (!payload?.membershipNumber) return json(400, { error: "membershipNumber is required" });
    if (!payload?.formData) return json(400, { error: "formData is required" });
    if (!payload?.signatureDataUrl) return json(400, { error: "signatureDataUrl is required" });

    const blobStore = getStore("member-applications");
    const key = payload.membershipNumber;
    const blobValue = {
      id: key,
      created_at: new Date().toISOString(),
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

    let stored = false;
    let storeError: string | null = null;

    try {
      await blobStore.setJSON(key, blobValue);
      stored = true;
    } catch (e) {
      storeError = e instanceof Error ? e.message : String(e);
      console.error("submit-application store error", storeError);
    }

    let emailSent = false;
    let emailError: string | null = null;

    try {
      const html = `
        <h2>New Membership Application</h2>
        <p><strong>Membership Number:</strong> ${blobValue.membership_number}</p>
        <p><strong>Name:</strong> ${blobValue.full_name} ${blobValue.surname}</p>
        <p><strong>ID Number:</strong> ${blobValue.id_number}</p>
        <p><strong>Phone:</strong> ${blobValue.phone_number}</p>
        <p><strong>Email:</strong> ${blobValue.email ?? "Not provided"}</p>
        <p><strong>Address:</strong> ${blobValue.residential_address}</p>
        <p><strong>Province:</strong> ${blobValue.province}</p>
        <p><strong>City:</strong> ${blobValue.city}</p>
        <p><strong>Area/Suburb:</strong> ${blobValue.area_suburb}</p>
        <p><strong>Submitted:</strong> ${new Date(blobValue.created_at).toLocaleString("en-ZA")}</p>
        <hr />
        <p><strong>Signature:</strong></p>
        <img src="${blobValue.signature_data_url}" alt="Signature" style="max-width: 320px; height: auto; border: 1px solid #ddd; border-radius: 8px;" />
      `;

      await sendViaResend({
        to: "info@shosh.org.za",
        subject: `New Membership Application - ${blobValue.membership_number}`,
        html,
      });
      emailSent = true;
    } catch (e) {
      emailError = e instanceof Error ? e.message : String(e);
      console.error("submit-application email error", emailError);
    }

    return json(200, { success: true, application: blobValue, stored, storeError, emailSent, emailError });
  } catch (error) {
    console.error("submit-application error", error);
    return json(500, { error: "Internal server error" });
  }
};
