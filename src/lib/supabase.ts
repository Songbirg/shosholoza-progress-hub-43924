import { createClient } from "@supabase/supabase-js";

// Supabase anon key is intentionally public — data is protected by Row Level Security (RLS) policies
const supabaseUrl = "https://szvovmtjwszfiyfdqqag.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6dm92bXRqd3N6Zml5ZmRxcWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NTI0MjQsImV4cCI6MjEwODIyODQyNH0.GkuyRnjXKDmVldSyCHaBnImA8IcE6wMWbkQcqPeXlAk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Typed helpers ────────────────────────────────────────────────────────────

export interface MembershipApplication {
  id?: string;
  created_at?: string;
  membership_number: string;
  full_name: string;
  surname: string;
  date_of_birth?: string;
  id_number?: string;
  phone_number: string;
  email?: string;
  residential_address?: string;
  province: string;
  city: string;
  area_suburb?: string;
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
  motivation?: string;
  status?: "pending" | "approved" | "rejected";
  user_agent?: string;
}

export interface InvestorInquiry {
  id?: string;
  created_at?: string;
  full_name: string;
  email: string;
  phone: string;
  company?: string;
  investment_range: string;
  area_of_interest: string;
  message: string;
  status?: "new" | "contacted" | "declined";
  user_agent?: string;
}
