"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimited } from "@/lib/rate-limit";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizePhone(phone: string): string {
  return phone.startsWith("+") ? phone : `+${phone}`;
}

function syntheticEmailFor(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `${digits}@safetag.internal`;
}

async function storeOtp(phone: string): Promise<void> {
  const admin = createAdminClient();
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await admin.from("otp_codes").insert({
    phone,
    code,
    expires_at: expiresAt,
  });

  // DEV MODE: log the code instead of sending a real SMS.
  // Replace this with a real SMS provider call before the pilot (Milestone 7).
  console.log(`\n🔐 OTP for ${phone}: ${code}\n`);
}

async function checkOtp(phone: string, code: string): Promise<boolean> {
  const admin = createAdminClient();

  const { data: otpRecord } = await admin
    .from("otp_codes")
    .select("id")
    .eq("phone", phone)
    .eq("code", code)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!otpRecord) return false;

  await admin.from("otp_codes").update({ used: true }).eq("id", otpRecord.id);
  return true;
}

// ---- Login flow ----

export async function requestOtp(phone: string) {
  const formattedPhone = normalizePhone(phone);

  // Rate limit OTP requests per phone number to prevent SMS-bombing abuse
  if (isRateLimited(`otp-request-${formattedPhone}`, 5, 60_000)) {
    return { success: false, message: "Too many attempts. Please wait a minute and try again." };
  }

  await storeOtp(formattedPhone);
  return { success: true as const, message: undefined as string | undefined };
}

export async function verifyOtp(phone: string, otp: string) {
  const formattedPhone = normalizePhone(phone);

  // Rate limit OTP verification attempts per phone number to prevent brute-force
  if (isRateLimited(`otp-verify-${formattedPhone}`, 5, 60_000)) {
    return { success: false, message: "Too many attempts. Please wait a minute and try again." };
  }

  const valid = await checkOtp(formattedPhone, otp);
  if (!valid) {
    return { success: false, message: "Invalid or expired code." };
  }

  const admin = createAdminClient();
  const syntheticEmail = syntheticEmailFor(formattedPhone);

  // If this phone already has a guardian row (from earlier testing),
  // backfill the synthetic email onto that SAME auth user so we don't
  // create a duplicate identity and orphan their existing bracelets.
  const { data: existingGuardian } = await admin
    .from("guardians")
    .select("id")
    .eq("phone", formattedPhone)
    .maybeSingle();

  if (existingGuardian?.id) {
    await admin.auth.admin.updateUserById(existingGuardian.id, {
      email: syntheticEmail,
      email_confirm: true,
    });
  }

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: syntheticEmail,
  });

  if (linkError || !linkData?.properties?.hashed_token) {
    return { success: false, message: "Could not sign in." };
  }

  const supabase = await createClient();
  const { data: sessionData, error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: "email",
  });

  if (verifyError || !sessionData.user) {
    return { success: false, message: "Could not sign in." };
  }

  await supabase.from("guardians").upsert(
    { id: sessionData.user.id, phone: formattedPhone },
    { onConflict: "id" }
  );

  return { success: true };
}

// ---- Re-auth flow (for sensitive actions like deactivation) ----

export async function requestReauthOtp() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not logged in." };
  }

  const admin = createAdminClient();
  const { data: guardian } = await admin
    .from("guardians")
    .select("phone")
    .eq("id", user.id)
    .single();

  if (!guardian?.phone) {
    return { success: false, message: "No phone on file." };
  }

  if (isRateLimited(`otp-request-${guardian.phone}`, 5, 60_000)) {
    return { success: false, message: "Too many attempts. Please wait a minute and try again." };
  }

  await storeOtp(guardian.phone);
  return { success: true, phone: guardian.phone };
}

export async function confirmReauthOtp(otp: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not logged in." };
  }

  const admin = createAdminClient();
  const { data: guardian } = await admin
    .from("guardians")
    .select("phone")
    .eq("id", user.id)
    .single();

  if (!guardian?.phone) {
    return { success: false, message: "No phone on file." };
  }

  if (isRateLimited(`otp-verify-${guardian.phone}`, 5, 60_000)) {
    return { success: false, message: "Too many attempts. Please wait a minute and try again." };
  }

  const valid = await checkOtp(guardian.phone, otp);
  if (!valid) {
    return { success: false, message: "Invalid code." };
  }

  return { success: true };
}

// ---- Backup email ----

export async function updateBackupEmail(email: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not logged in." };
  }

  const trimmedEmail = email.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { success: false, message: "Please enter a valid email." };
  }

  const { error } = await supabase
    .from("guardians")
    .update({ backup_email: trimmedEmail })
    .eq("id", user.id);

  if (error) {
    return { success: false, message: "Could not save email." };
  }

  return { success: true };
}
