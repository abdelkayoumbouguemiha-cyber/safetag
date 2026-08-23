import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

type NotifyResult = {
  channel: "push" | "sms" | "email";
  status: "sent" | "failed";
};

export async function notifyGuardian(scanLogId: string, braceletId: string) {
  const supabase = createAdminClient();

  const { data: bracelet } = await supabase
    .from("children_bracelets")
    .select("guardian_id, child_first_name")
    .eq("id", braceletId)
    .single();

  if (!bracelet?.guardian_id) {
    return { notified: false };
  }

  const { data: guardian } = await supabase
    .from("guardians")
    .select("phone, backup_email")
    .eq("id", bracelet.guardian_id)
    .single();

  if (!guardian) {
    return { notified: false };
  }

  const attempts: NotifyResult[] = [];

  if (guardian.backup_email) {
    try {
      await resend.emails.send({
        from: "SafeTag <onboarding@resend.dev>",
        to: guardian.backup_email,
        subject: "Your child's bracelet was scanned",
        text: `${bracelet.child_first_name}'s SafeTag bracelet was just scanned. Someone may be trying to help reunite you. Check your SafeTag dashboard for details.`,
      });
      attempts.push({ channel: "email", status: "sent" });
    } catch {
      attempts.push({ channel: "email", status: "failed" });
    }
  }

  for (const attempt of attempts) {
    await supabase.from("notifications").insert({
      scan_log_id: scanLogId,
      channel: attempt.channel,
      status: attempt.status,
    });
  }

  const anySucceeded = attempts.some((a) => a.status === "sent");
  return { notified: anySucceeded };
}
