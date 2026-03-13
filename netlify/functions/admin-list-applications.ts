import { Handler } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, {});
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  try {
    const blobStore = getStore("member-applications");
    const list = await blobStore.list();
    const blobs = list.blobs || [];

    const applications = await Promise.all(
      blobs.map(async (blob) => {
        const data = await blobStore.get(blob.key, { type: "json" });
        return data;
      })
    );

    const sorted = applications.sort((a, b) => {
      const aDate = new Date(a.created_at).getTime();
      const bDate = new Date(b.created_at).getTime();
      return bDate - aDate;
    });

    return json(200, { applications: sorted });
  } catch (error) {
    console.error("admin-list-applications error", error);
    const detail = error instanceof Error ? error.message : String(error);
    return json(500, { error: "Internal server error", detail });
  }
};
