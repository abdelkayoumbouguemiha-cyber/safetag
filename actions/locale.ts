"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/locale";

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();

  // سنة كاملة، متاح فكل الموقع، يبقى حتى بعد تسجيل الخروج
  cookieStore.set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  // لو المستخدم مسجل دخول، نحفظو تفضيلو فحسابو (يترجع من جهاز آخر)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from("guardians")
      .update({ preferred_locale: locale })
      .eq("id", user.id);
  }

  return { success: true };
}
