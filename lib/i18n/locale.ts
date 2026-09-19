import { cookies, headers } from "next/headers";

export type Locale = "ar" | "fr" | "en";
export const LOCALES: Locale[] = ["ar", "fr", "en"];
export const LOCALE_COOKIE = "safetag_lang";

function isValidLocale(value: string | undefined | null): value is Locale {
  return !!value && LOCALES.includes(value as Locale);
}

function detectFromAcceptLanguage(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return "ar";
  if (acceptLanguage.includes("fr")) return "fr";
  if (acceptLanguage.includes("ar")) return "ar";
  if (acceptLanguage.includes("en")) return "en";
  return "ar";
}

// يستدعى فأي Server Component: يحدد اللغة الحالية حسب الأولوية
// كوكي > Accept-Language المتصفح > العربية كافتراضي.
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(LOCALE_COOKIE)?.value;

  if (isValidLocale(cookieValue)) {
    return cookieValue;
  }

  const headersList = await headers();
  return detectFromAcceptLanguage(headersList.get("accept-language"));
}
