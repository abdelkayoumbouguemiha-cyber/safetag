import { Resend } from "resend";
import twilio from "twilio";
import webpush from "./web-push";
import { createAdminClient } from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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
  let pushSucceeded = false;
  let emailSucceeded = false;

  // Step 1: try push first (fastest, free)
  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("guardian_id", bracelet.guardian_id);

  if (subscriptions && subscriptions.length > 0) {
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify({
            title: "SafeTag Alert",
            body: `${bracelet.child_first_name}'s bracelet was just scanned.`,
          })
        );
        pushSucceeded = true;
      } catch {
        // individual subscription may be expired — continue trying others
      }
    }
    attempts.push({ channel: "push", status: pushSucceeded ? "sent" : "failed" });
  }

  // Step 2: fallback to email if push failed or wasn't available
  if (!pushSucceeded && guardian.backup_email) {
    try {
      await resend.emails.send({
        from: "SafeTag <onboarding@resend.dev>",
        to: guardian.backup_email,
        subject: "Your child's bracelet was scanned",
        text: `${bracelet.child_first_name}'s SafeTag bracelet was just scanned. Someone may be trying to help reunite you. Check your SafeTag dashboard for details.`,
      });
      attempts.push({ channel: "email", status: "sent" });
      emailSucceeded = true;
    } catch {
      attempts.push({ channel: "email", status: "failed" });
    }
  }
  // Step 3: SMS fallback — DISABLED for now.
  // Twilio Trial requires pre-approved Content Templates for SMS,
  // and Trial accounts don't have access to Content Template Builder.
  // Re-enable this once on a paid Twilio account (Milestone 7).
// Step 3: final fallback to SMS if both push and email failed
//  if (!pushSucceeded && !emailSucceeded && guardian.phone) {
//    try {
//      await twilioClient.messages.create({
//        body: `SafeTag: ${bracelet.child_first_name}'s bracelet was just scanned. Check your dashboard.`,
//        from: process.env.TWILIO_PHONE_NUMBER,
//        to: guardian.phone,
//      });
//      attempts.push({ channel: "sms", status: "sent" });
//    } catch (err) {
//      console.error("SMS send error:", err);
//      attempts.push({ channel: "sms", status: "failed" });
//    }
//  }

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
