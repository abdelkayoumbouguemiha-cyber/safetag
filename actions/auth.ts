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

  const { error } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token: otp,
    type: "sms",
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
