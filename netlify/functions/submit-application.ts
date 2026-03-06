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

    await blobStore.setJSON(key, blobValue);
    return json(200, { success: true, application: blobValue });
  } catch (error) {
    console.error("submit-application error", error);
    return json(500, { error: "Internal server error" });
  }
};
