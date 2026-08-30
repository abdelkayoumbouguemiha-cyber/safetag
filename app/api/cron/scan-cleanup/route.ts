import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const WARNING_DAYS = 83; // 90 - 7 day warning window
const DELETE_DAYS = 90;

export async function GET(request: Request) {
  // Protect this endpoint — only Vercel Cron (or someone with the secret) can trigger it
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const warningCutoff = new Date(Date.now() - WARNING_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const deleteCutoff = new Date(Date.now() - DELETE_DAYS * 24 * 60 * 60 * 1000).toISOString();

  // Step 1: warn guardians about scans nearing deletion (83+ days old, not yet warned)
  const { data: scansNearingDeletion } = await admin
    .from("scan_logs")
    .select("id, bracelet_id, children_bracelets(guardian_id, child_first_name)")
    .lte("created_at", warningCutoff)
    .gt("created_at", deleteCutoff)
    .eq("deletion_warning_sent", false);

  let warningsSent = 0;

  if (scansNearingDeletion && scansNearingDeletion.length > 0) {
    // Group by guardian
    const byGuardian = new Map<string, { name: string; count: number; scanIds: string[] }>();

    for (const scan of scansNearingDeletion) {
      const bracelet = scan.children_bracelets as unknown as {
        guardian_id: string;
        child_first_name: string;
      } | null;
      if (!bracelet?.guardian_id) continue;

      const existing = byGuardian.get(bracelet.guardian_id);
      if (existing) {
        existing.count += 1;
        existing.scanIds.push(scan.id);
      } else {
        byGuardian.set(bracelet.guardian_id, {
          name: bracelet.child_first_name,
          count: 1,
          scanIds: [scan.id],
        });
      }
    }

    for (const [guardianId, info] of byGuardian) {
      const { data: guardian } = await admin
        .from("guardians")
        .select("backup_email")
        .eq("id", guardianId)
        .single();

      if (guardian?.backup_email) {
        try {
          await resend.emails.send({
            from: "SafeTag <onboarding@resend.dev>",
            to: guardian.backup_email,
            subject: "Old scan records will be deleted soon",
            text: `${info.count} scan record(s) for ${info.name}'s bracelet are older than 83 days and will be permanently deleted in 7 days, per our data retention policy. No action is needed.`,
          });
          warningsSent += 1;
        } catch {
          // best-effort — don't block cleanup on email failure
        }
      }

      await admin
        .from("scan_logs")
        .update({ deletion_warning_sent: true })
        .in("id", info.scanIds);
    }
  }

  // Step 2: delete scan logs older than 90 days (and their dependent rows)
  const { data: scansToDelete } = await admin
    .from("scan_logs")
    .select("id")
    .lte("created_at", deleteCutoff);

  let deletedCount = 0;

  if (scansToDelete && scansToDelete.length > 0) {
    const idsToDelete = scansToDelete.map((s) => s.id);

    // Delete dependent rows first (no cascade configured on these FKs)
    await admin.from("notifications").delete().in("scan_log_id", idsToDelete);
    await admin.from("scan_acknowledgements").delete().in("scan_log_id", idsToDelete);

    const { error: deleteError, count } = await admin
      .from("scan_logs")
      .delete({ count: "exact" })
      .in("id", idsToDelete);

    if (!deleteError) {
      deletedCount = count ?? 0;
    }
  }

  return NextResponse.json({
    warningsSent,
    deletedCount,
  });
}
