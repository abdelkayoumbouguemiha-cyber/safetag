import Image from "next/image";
import { notFound } from "next/navigation";
import ScanForm from "./scan-form";
import { translations } from "@/lib/i18n/translations";
import { getLocale } from "@/lib/i18n/locale";
import LanguageToggle from "@/components/language-toggle";

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

export default async function ScanPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const result = await getBraceletInfo(code);

  const locale = await getLocale();
  const t = translations[locale] ?? translations.ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  if ("notFound" in result || "error" in result) {
    notFound();
  }

  if ("inactive" in result) {
    return (
      <main dir={dir} className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg p-6 text-center">
        <LanguageToggle current={locale} />
        <Image src="/brand/logo.jpeg" alt="SafeTag" width={56} height={56} className="rounded-2xl" />
        <h1 className="text-xl font-semibold text-ink">{t.inactiveBracelet}</h1>
      </main>
    );
  }

  return (
    <main dir={dir} className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg p-6 text-center">
      <LanguageToggle current={locale} />

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
