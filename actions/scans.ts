"use server";

import { createClient } from "@/lib/supabase/server";

export async function getScanHistory(braceletId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scan_logs")
    .select("id, created_at, consent_given, approx_lat, approx_lng, contact_shared")
    .eq("bracelet_id", braceletId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return { scans: [] };
  return { scans: data };
}

export async function acknowledgeScan(scanLogId: string, status: "acknowledged" | "resolved") {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false };
  }

  const { error } = await supabase.from("scan_acknowledgements").upsert(
    {
      scan_log_id: scanLogId,
      status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "scan_log_id" }
  );

  return { success: !error };
}

export async function shareScanContact(scanLogId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false };
  }

  const { data, error } = await supabase.rpc("share_scan_contact", {
    p_scan_log_id: scanLogId,
  });

  if (error || !data) {
    return { success: false };
  }

  return { success: true };
}
