import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Database-backed rate limiter — replaces the in-memory Map approach,
 * which is unreliable on Vercel serverless (each invocation may run
 * in a different container, so in-memory state doesn't persist
 * reliably across requests).
 */
export async function isRateLimitedDb(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60_000
): Promise<boolean> {
  const admin = createAdminClient();
  const windowStart = new Date(Date.now() - windowMs).toISOString();

  // Count recent hits for this key within the window
  const { count } = await admin
    .from("rate_limit_hits")
    .select("*", { count: "exact", head: true })
    .eq("key", key)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= maxRequests) {
    return true;
  }

  // Record this hit
  await admin.from("rate_limit_hits").insert({ key });

  return false;
}
