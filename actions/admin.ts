"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// TEMPORARY: hardcoded admin check for solo-founder stage.
// Replace with a proper admin role/table before onboarding a team.
const ADMIN_USER_ID = "1bfef704-5c8c-49c5-8ee1-0c9ba374946d";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== ADMIN_USER_ID) {
    throw new Error("Not authorized");
  }
}

export async function generateBraceletCodes(count: number) {
  await requireAdmin();

  if (count < 1 || count > 1000) {
    return { success: false, message: "Count must be between 1 and 1000." };
  }

  const admin = createAdminClient();

  const rows = Array.from({ length: count }, () => ({
    status: "unactivated" as const,
  }));

  const { data, error } = await admin
    .from("children_bracelets")
    .insert(rows)
    .select("id");

  if (error || !data) {
    return { success: false, message: "Could not generate codes." };
  }

  return { success: true, ids: data.map((d) => d.id) };
}

export async function getAdminStats() {
  await requireAdmin();

  const admin = createAdminClient();

  const { count: total } = await admin
    .from("children_bracelets")
    .select("*", { count: "exact", head: true });

  const { count: activated } = await admin
    .from("children_bracelets")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: scanned } = await admin
    .from("scan_logs")
    .select("*", { count: "exact", head: true });

  return {
    total: total ?? 0,
    activated: activated ?? 0,
    scanned: scanned ?? 0,
  };
}
export async function getFlaggedScans() {
  await requireAdmin();

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("flagged_scans")
    .select("id, bracelet_id, reason, reviewed, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return { flags: [] };
  return { flags: data };
}

export async function markFlagReviewed(flagId: string) {
  await requireAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from("flagged_scans")
    .update({ reviewed: true })
    .eq("id", flagId);

  return { success: !error };
}
