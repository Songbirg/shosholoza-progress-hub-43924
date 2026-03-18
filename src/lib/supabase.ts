import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "[Supabase] Missing environment variables.\n" +
      "Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file, " +
      "then restart the dev server with: npm run dev",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Typed helpers ────────────────────────────────────────────────────────────

export interface MembershipApplication {
  id?: string;
  created_at?: string;
  membership_number: string;
  full_name: string;
  surname: string;
  date_of_birth: string;
  id_number: string;
  phone_number: string;
  email?: string;
  residential_address: string;
  province: string;
  city: string;
  area_suburb: string;
  signature_data_url?: string;
  user_agent?: string;
  status?: "pending" | "approved" | "rejected";
}

export interface ContactMessage {
  id?: string;
  created_at?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CouncillorApplication {
  id?: string;
  created_at?: string;
  name: string;
  email: string;
  phone: string;
  municipality: string;
  status?: "pending" | "approved" | "rejected";
  user_agent?: string;
}
