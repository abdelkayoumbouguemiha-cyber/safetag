import Image from "next/image";
import Link from "next/link";
import { homeTranslations } from "@/lib/i18n/site-translations";
import { getLocale } from "@/lib/i18n/locale";
import LanguageToggle from "@/components/language-toggle";

export default async function HomePage() {
  const locale = await getLocale();
  const t = homeTranslations[locale] ?? homeTranslations.ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-bg text-ink">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <Image src="/brand/logo.jpeg" alt="SafeTag" width={32} height={32} className="rounded-lg" />
          SafeTag
        </span>
        <div className="flex items-center gap-4">
          <LanguageToggle current={locale} />
          <Link
            href="/login"
            className="rounded-lg border border-brand-green px-5 py-2 text-sm font-medium text-brand-green-dark transition-colors hover:bg-brand-green hover:text-white"
          >
            {t.login}
          </Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center">
        <Image src="/brand/logo.jpeg" alt="SafeTag" width={120} height={120} className="rounded-3xl shadow-sm" />
        <h1 className="max-w-xl font-display text-4xl font-semibold leading-tight text-brand-green-dark sm:text-5xl">
          {t.heroTitle}
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-ink-muted">{t.heroText}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-brand-green px-7 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark"
          >
            {t.ctaLogin}
          </Link>
          
          <Link href="/buy"
            className="rounded-lg border border-line px-7 py-3 text-sm font-medium text-ink transition-colors hover:border-brand-green"
          >
            {t.ctaBuy}
          </Link>
        </div>
      </section>

      <section className="border-t border-line bg-surface py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-10 text-center font-display text-2xl font-semibold text-brand-green-dark">
            {t.howItWorks}
          </h2>
          <div className="grid gap-8 sm:grid-cols-4">
            <Step n="١" title={t.step1Title} text={t.step1Text} />
            <Step n="٢" title={t.step2Title} text={t.step2Text} />
            <Step n="٣" title={t.step3Title} text={t.step3Text} />
            <Step n="٤" title={t.step4Title} text={t.step4Text} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h2 className="mb-4 font-display text-2xl font-semibold text-brand-green-dark">
          {t.privacyTitle}
        </h2>
        <p className="leading-relaxed text-ink-muted">{t.privacyText}</p>
      </section>

      <footer className="border-t border-line py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-6 text-sm text-ink-muted">
          <span>SafeTag © 2026</span>
          <a href="mailto:contact@safetag.dz" className="hover:text-brand-green-dark">
            contact@safetag.dz
          </a>
        </div>
      </footer>
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-soft font-display font-semibold text-brand-green-dark">
        {n}
      </div>
      <h3 className="mb-1 text-sm font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-muted">{text}</p>
    </div>
  );
}
