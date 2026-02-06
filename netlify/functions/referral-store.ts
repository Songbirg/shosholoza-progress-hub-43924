import { getStore } from "@netlify/blobs";

export type StoredVisit = {
  sessionId: string;
  timestamp: number;
  fingerprint: string;
  userAgent: string;
  timeOnPage: number;
  ipHash: string;
  validated: boolean;
};

const store = getStore("referrals");

const visitsKey = (sessionId: string) => `visits:${sessionId}`;

export const getVisits = async (sessionId: string): Promise<StoredVisit[]> => {
  const data = await store.get(visitsKey(sessionId), { type: "json" });
  if (!data || !Array.isArray(data)) return [];
  return data as StoredVisit[];
};

export const setVisits = async (sessionId: string, next: StoredVisit[]): Promise<void> => {
  await store.setJSON(visitsKey(sessionId), next);
};

export const getValidatedCount = async (sessionId: string): Promise<number> => {
  const v = await getVisits(sessionId);
  return v.filter((x) => x.validated).length;
};
