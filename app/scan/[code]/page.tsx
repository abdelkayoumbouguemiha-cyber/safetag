import Image from "next/image";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ScanForm from "./scan-form";
import { translations, detectLocale } from "@/lib/i18n/translations";

async function getBraceletInfo(code: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/bracelet/${code}`,
    { cache: "no-store" }
  );

  if (res.status === 404) return { notFound: true as const };
  if (res.status === 410) return { inactive: true as const };
  if (!res.ok) return { error: true as const };

  const data = await res.json();
  return { childFirstName: data.child_first_name as string };
}

function LanguageBar({ locale }: { locale: string }) {
  return (
    <div className="flex gap-4 text-xs text-ink-muted">
      <a href="?lang=ar" className={locale === "ar" ? "font-medium text-brand-green-dark underline underline-offset-4" : "hover:text-ink"}>
        العربية
      </a>
      <a href="?lang=fr" className={locale === "fr" ? "font-medium text-brand-green-dark underline underline-offset-4" : "hover:text-ink"}>
        Français
      </a>
      <a href="?lang=en" className={locale === "en" ? "font-medium text-brand-green-dark underline underline-offset-4" : "hover:text-ink"}>
        English
      </a>
    </div>
  );
}

export default async function ScanPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { code } = await params;
  const { lang } = await searchParams;
  const result = await getBraceletInfo(code);

  const headersList = await headers();
  const locale =
    (lang as keyof typeof translations) ??
    detectLocale(headersList.get("accept-language"));
  const t = translations[locale] ?? translations.en;
  const dir = locale === "ar" ? "rtl" : "ltr";

  if ("notFound" in result || "error" in result) {
    notFound();
  }

  if ("inactive" in result) {
    return (
      <main dir={dir} className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg p-6 text-center">
        <LanguageBar locale={locale} />
        <Image src="/brand/logo.jpeg" alt="SafeTag" width={56} height={56} className="rounded-2xl" />
        <h1 className="text-xl font-semibold text-ink">{t.inactiveBracelet}</h1>
      </main>
    );
  }

  return (
    <main dir={dir} className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg p-6 text-center">
      <LanguageBar locale={locale} />

      <Image src="/brand/logo.jpeg" alt="SafeTag" width={56} height={56} className="rounded-2xl shadow-sm" />

      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <h1 className="font-display text-2xl font-semibold leading-snug text-brand-green-dark">
          {t.lostChild(result.childFirstName)}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t.tapToNotify}</p>

        <div className="mt-6">
          <ScanForm code={code} locale={locale} />
        </div>
      </div>

      
      <a
        href="tel:1021"
        className="text-sm text-ink-muted underline underline-offset-4 hover:text-brand-green-dark"
      >
        {locale === "ar" ? "أو اتصل مباشرة بالخط الأخضر: 1021" : locale === "fr" ? "Ou appelez directement le : 1021" : "Or call directly: 1021"}
      </a>
    </main>
  );
}
