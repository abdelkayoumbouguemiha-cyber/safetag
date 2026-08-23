import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { scanRequestSchema } from "@/lib/validation/scan";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Step 1: identify the caller by IP for rate limiting
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: "Too many attempts. Try again shortly.",
        fallback_hotline: "1021",
      },
      { status: 429 }
    );
  }

  // Step 2: validate the request body
  const body = await request.json().catch(() => null);
  const parsed = scanRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", message: "Missing or invalid fields." },
      { status: 400 }
    );
  }

  const { code, consent_location, lat, lng } = parsed.data;

  // Step 3: use the admin client — this write must go through server-side
  // logic only (rate limiting, validation), never directly from the browser.
  const supabase = createAdminClient();

  // Confirm the bracelet exists and is active before logging a scan
  const { data: bracelet } = await supabase
    .from("children_bracelets")
    .select("id, status")
    .eq("id", code)
    .single();

  if (!bracelet || bracelet.status !== "active") {
    return NextResponse.json(
      { error: "not_found", message: "This code is not recognized." },
      { status: 404 }
    );
  }

  const { data: scanLog, error } = await supabase
    .from("scan_logs")
    .insert({
      bracelet_id: code,
      ip_address: ip,
      consent_given: consent_location,
      approx_lat: consent_location ? lat : null,
      approx_lng: consent_location ? lng : null,
    })
    .select("id")
    .single();

  if (error || !scanLog) {
    return NextResponse.json(
      {
        error: "server_error",
        message: "Something went wrong.",
        fallback_hotline: "1021",
      },
      { status: 500 }
    );
  }

  // Notification pipeline (push/SMS/email) will be wired in Milestone 4 —
  // for now, we just confirm the scan was recorded.
  // Trigger the notification pipeline
  const { notifyGuardian } = await import("@/lib/notifications/notify");
  try {
    await notifyGuardian(scanLog.id, code);
  } catch (err) {
    console.error("Notification pipeline error:", err);
  }

  return NextResponse.json({
    status: "queued",
    scan_log_id: scanLog.id,
    fallback_hotline: "1021",
  });
}
