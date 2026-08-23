"use server";

import { createClient } from "@/lib/supabase/server";

export async function requestOtp(phone: string) {
  const supabase = await createClient();

  // Ensure phone is in E.164 format (e.g. +213777762416)
  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

  const { error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

export async function verifyOtp(phone: string, otp: string) {
  const supabase = await createClient();

  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

  const { error, data } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token: otp,
    type: "sms",
  });

  if (error) {
    return { success: false, message: error.message };
  }

  // Ensure a matching row exists in our guardians table.
  // Supabase Auth creates the auth.users row automatically,
  // but our own guardians table needs its own row too.
  if (data.user) {
    await supabase.from("guardians").upsert(
      {
        id: data.user.id,
        phone: formattedPhone,
      },
      { onConflict: "id" }
    );
  }

  return { success: true };
}
export async function updateBackupEmail(email: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not logged in." };
  }

  const trimmedEmail = email.trim();

  // Basic email format check
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
export async function requestReauthOtp() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.phone) {
    return { success: false, message: "Not logged in." };
  }

  const { error } = await supabase.auth.signInWithOtp({
    phone: user.phone,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, phone: user.phone };
}

export async function confirmReauthOtp(otp: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.phone) {
    return { success: false, message: "Not logged in." };
  }

  const { error } = await supabase.auth.verifyOtp({
    phone: user.phone,
    token: otp,
    type: "sms",
  });

  if (error) {
    return { success: false, message: "Invalid code." };
  }

  return { success: true };
}
