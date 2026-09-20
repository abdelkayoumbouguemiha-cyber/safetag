import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimitedDb } from "@/lib/rate-limit-db";
import { z } from "zod";

const idSchema = z.string().uuid();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const trustedForwardedFor = request.headers.get("x-vercel-forwarded-for");
  const devFallback =
    process.env.NODE_ENV === "development"
      ? request.headers.get("x-forwarded-for")
      : null;
  const ip = (trustedForwardedFor ?? devFallback)?.split(",")[0]?.trim() ?? "unknown";

  // 30/min per IP is enough for polling every few seconds, and cheap
  // to abuse-proof since scan_log ids are unguessable UUIDs anyway.
  if (await isRateLimitedDb(`scan-status-${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const admin = createAdminClient();

  const { data: scanLog } = await admin
    .from("scan_logs")
    .select("contact_shared, bracelet_id")
    .eq("id", id)
    .single();

  if (!scanLog) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (!scanLog.contact_shared) {
    return NextResponse.json({ contact_shared: false, phone: null });
  }

  const { data: bracelet } = await admin
    .from("children_bracelets")
    .select("guardian_id")
    .eq("id", scanLog.bracelet_id)
    .single();

  if (!bracelet?.guardian_id) {
    return NextResponse.json({ contact_shared: false, phone: null });
  }

  const { data: guardian } = await admin
    .from("guardians")
    .select("phone")
    .eq("id", bracelet.guardian_id)
    .single();

  return NextResponse.json({
    contact_shared: true,
    phone: guardian?.phone ?? null,
  });
}
