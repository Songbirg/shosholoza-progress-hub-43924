import { getStore } from "@netlify/blobs";

export const getConfiguredStore = (name: string) => {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;

  if (!siteID || !token) {
    throw new Error(
      "Netlify Blobs is not configured. Set NETLIFY_SITE_ID (or SITE_ID) and NETLIFY_API_TOKEN environment variables."
    );
  }

  return getStore(name, { siteID, token });
};
