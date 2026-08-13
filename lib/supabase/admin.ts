import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ⚠️ SERVICE ROLE CLIENT — bypasses all RLS policies.
// NEVER import this file in any client component or client-facing code.
// Only used server-side in actions/admin.ts and Supabase Edge Functions.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
