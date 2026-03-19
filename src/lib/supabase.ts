import { createClient } from "@supabase/supabase-js";

// Supabase anon key is intentionally public — data is protected by Row Level Security (RLS) policies
const supabaseUrl = "https://jpafcmixtchvtrkhltst.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwYWZjbWl4dGNodnRya2hsdHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MzIzODYsImV4cCI6MjA2OTEwODM4Nn0.dR0-DW8_ekftD9DZjGutGuyh4kiPG338NQ367tC8Pcw";

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
