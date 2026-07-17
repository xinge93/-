import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey && adminEmail);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })
  : null;

export function isAdminUser(user) {
  return Boolean(user?.email && adminEmail && user.email.toLowerCase() === adminEmail);
}
