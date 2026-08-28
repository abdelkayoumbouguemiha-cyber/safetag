import { createAdminClient } from "@/lib/supabase/admin";

const MAX_SCANS_PER_HOUR = 5;

export async function flagIfSuspicious(braceletId: string, ip: string) {
  const admin = createAdminClient();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data: recentScans } = await admin
    .from("scan_logs")
    .select("id, ip_address, created_at")
    .eq("bracelet_id", braceletId)
    .gte("created_at", oneHourAgo)
    .order("created_at", { ascending: false });

  if (!recentScans) return;

  // Heuristic 1: too many scans in a short window
  if (recentScans.length > MAX_SCANS_PER_HOUR) {
    await admin.from("flagged_scans").insert({
      bracelet_id: braceletId,
      reason: `${recentScans.length} scans in the last hour (threshold: ${MAX_SCANS_PER_HOUR})`,
    });
    return;
  }

  // Heuristic 2: same bracelet scanned from multiple distinct IPs quickly
  const distinctIps = new Set(recentScans.map((s) => s.ip_address));
  if (distinctIps.size >= 3) {
    await admin.from("flagged_scans").insert({
      bracelet_id: braceletId,
      reason: `Scanned from ${distinctIps.size} different IPs within an hour`,
    });
  }
}
