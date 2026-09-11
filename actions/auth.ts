"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimitedDb } from "@/lib/rate-limit-db";
import { createHash } from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOtp(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function storeAndSendOtp(email: string): Promise<{ success: boolean; message?: string }> {
  const admin = createAdminClient();
  const code = generateOtp();
  const hashedCode = hashOtp(code);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await admin.from("otp_codes").insert({
    phone: email, // reusing the existing "phone" column as a generic identifier
    code: hashedCode,
    expires_at: expiresAt,
  });

  // DEV MODE: also log locally for convenience — never runs in production.
  if (process.env.NODE_ENV === "development") {
    console.log(`\n🔐 OTP for ${email}: ${code}\n`);
  }

  try {
    await resend.emails.send({
      from: "SafeTag <onboarding@resend.dev>",
      to: email,
      subject: "Your SafeTag login code",
      text: `Your login code is: ${code}\n\nThis code expires in 10 minutes.`,
    });
    return { success: true };
  } catch {
    return { success: false, message: "Could not send the code. Please try again." };
  }
}

async function checkOtp(email: string, code: string): Promise<boolean> {
  const admin = createAdminClient();
  const hashedCode = hashOtp(code);

  const { data: otpRecord } = await admin
    .from("otp_codes")
    .select("id")
    .eq("phone", email)
    .eq("code", hashedCode)
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

export async function requestOtp(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (await isRateLimitedDb(`otp-request-${normalizedEmail}`, 5, 60_000)) {
    return { success: false, message: "Too many attempts. Please wait a minute and try again." };
  }

  const result = await storeAndSendOtp(normalizedEmail);
  return result;
}

export async function verifyOtp(email: string, otp: string) {
  const normalizedEmail = normalizeEmail(email);

  if (await isRateLimitedDb(`otp-verify-${normalizedEmail}`, 5, 60_000)) {
    return { success: false, message: "Too many attempts. Please wait a minute and try again." };
  }

  const valid = await checkOtp(normalizedEmail, otp);
  if (!valid) {
    return { success: false, message: "Invalid or expired code." };
  }

  const admin = createAdminClient();

  const { data: existingGuardian } = await admin
    .from("guardians")
    .select("id")
    .eq("backup_email", normalizedEmail)
    .maybeSingle();

  let userId: string;

  if (existingGuardian?.id) {
    userId = existingGuardian.id;
    await admin.auth.admin.updateUserById(userId, {
      email: normalizedEmail,
      email_confirm: true,
    });
  } else {
    // Check if an auth user already exists with this email (edge case: guardian
    // row was deleted but auth user wasn't, or first-ever login for this email)
    const { data: existingUsers } = await admin.auth.admin.listUsers();
    const existingAuthUser = existingUsers.users.find((u) => u.email === normalizedEmail);

    if (existingAuthUser) {
      userId = existingAuthUser.id;
    } else {
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email: normalizedEmail,
        email_confirm: true,
      });
      if (createError || !created.user) {
        return { success: false, message: "Could not create account." };
      }
      userId = created.user.id;
    }
  }

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: normalizedEmail,
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
    { id: sessionData.user.id, backup_email: normalizedEmail },
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
    .select("backup_email")
    .eq("id", user.id)
    .single();

  if (!guardian?.backup_email) {
    return { success: false, message: "No email on file." };
  }

  if (await isRateLimitedDb(`otp-request-${guardian.backup_email}`, 5, 60_000)) {
    return { success: false, message: "Too many attempts. Please wait a minute and try again." };
  }

  const result = await storeAndSendOtp(guardian.backup_email);
  if (!result.success) return result;

  return { success: true, message: undefined as string | undefined, email: guardian.backup_email as string | undefined };
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
    .select("backup_email")
    .eq("id", user.id)
    .single();

  if (!guardian?.backup_email) {
    return { success: false, message: "No email on file." };
  }

  if (await isRateLimitedDb(`otp-verify-${guardian.backup_email}`, 5, 60_000)) {
    return { success: false, message: "Too many attempts. Please wait a minute and try again." };
  }

  const valid = await checkOtp(guardian.backup_email, otp);
  if (!valid) {
    return { success: false, message: "Invalid code." };
  }

  const confirmationId = crypto.randomUUID();
  await admin.from("confirmed_reauth_actions").insert({
    id: confirmationId,
    guardian_id: user.id,
    expires_at: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
  });

  return { success: true, confirmationId };
}

// ---- Optional phone number (for direct contact by finders) ----

export async function updatePhone(phone: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not logged in." };
  }

  const trimmedPhone = phone.trim();

  if (trimmedPhone && !/^\+?[0-9]{8,15}$/.test(trimmedPhone)) {
    return { success: false, message: "Please enter a valid phone number." };
  }

  const { error } = await supabase
    .from("guardians")
    .update({ phone: trimmedPhone || null })
    .eq("id", user.id);

  if (error) {
    return { success: false, message: "Could not save phone number." };
  }

  return { success: true };
}
