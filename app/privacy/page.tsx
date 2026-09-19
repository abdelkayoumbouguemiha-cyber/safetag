import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/locale";
import { privacyTranslations } from "@/lib/i18n/privacy-translations";
import LanguageToggle from "@/components/language-toggle";

export const metadata: Metadata = {
  title: "SafeTag — سياسة الخصوصية",
};

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = privacyTranslations[locale] ?? privacyTranslations.ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-bg text-ink">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <Image src="/brand/logo.jpeg" alt="SafeTag" width={32} height={32} className="rounded-lg" />
          SafeTag
        </Link>
        <LanguageToggle current={locale} />
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16">
        <Link href="/" className="text-sm text-ink-muted hover:text-brand-green-dark">
          {t.backHome}
        </Link>

        <h1 className="mt-3 mb-2 font-display text-3xl font-semibold text-brand-green-dark">
          {t.pageTitle}
        </h1>
        <p className="mb-8 text-sm text-ink-muted">{t.lastUpdated}</p>

        <p className="mb-10 leading-relaxed text-ink">{t.intro}</p>

        <div className="flex flex-col gap-8">
          {t.sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 font-display text-lg font-semibold text-ink">
                {section.title}
              </h2>
              <ul className="flex flex-col gap-2">
                {section.body.map((line, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed text-ink-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-amber-soft bg-amber-soft/40 p-5">
          <p className="text-sm leading-relaxed text-ink">{t.disclaimer}</p>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-sm text-ink-muted">
          <p>{t.contactLabel}</p>
          <a href="mailto:contact@safetag.dz" className="text-brand-green-dark hover:underline">
            contact@safetag.dz
          </a>
        </div>
      </main>
    </div>
  );
}
