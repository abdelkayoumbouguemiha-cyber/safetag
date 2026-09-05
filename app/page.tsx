import Link from "next/link";
import { Fraunces } from "next/font/google";
import { homeTranslations, type SiteLocale } from "@/lib/i18n/site-translations";
import LanguageToggle from "@/components/language-toggle";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
});

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale: SiteLocale = lang === "fr" ? "fr" : "ar";
  const t = homeTranslations[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      dir={dir}
      className={`${fraunces.variable} min-h-screen bg-[#F7F8F6] text-[#12232E]`}
    >
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold tracking-tight">SafeTag</span>
        <div className="flex items-center gap-4">
          <LanguageToggle current={locale} />
          <Link
            href={`/login?lang=${locale}`}
            className="border border-[#12232E] px-5 py-2 text-sm font-medium transition-colors hover:bg-[#12232E] hover:text-white"
          >
            {t.login}
          </Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center">
        <BraceletIllustration />
        <h1
          className="max-w-xl text-4xl leading-tight sm:text-5xl"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {t.heroTitle}
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-[#4A5A61]">
          {t.heroText}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            href={`/login?lang=${locale}`}
            className="bg-[#12232E] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0B171F]"
          >
            {t.ctaLogin}
          </Link>
          <a href="mailto:contact@safetag.dz" className="border border-[#12232E]/20 px-7 py-3 text-sm font-medium text-[#12232E] transition-colors hover:border-[#12232E]">
            {t.ctaContact}
          </a>
        </div>
      </section>

      <section className="border-t border-[#12232E]/10 bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2
            className="mb-10 text-center text-2xl"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
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
        <h2
          className="mb-4 text-2xl"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {t.privacyTitle}
        </h2>
        <p className="leading-relaxed text-[#4A5A61]">{t.privacyText}</p>
      </section>

      <footer className="border-t border-[#12232E]/10 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-6 text-sm text-[#4A5A61]">
          <span>SafeTag © 2026</span>
          <a href="mailto:contact@safetag.dz" className="hover:text-[#12232E]">
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
      <div
        className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#E4EEEB] text-[#2C6E5C]"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        {n}
      </div>
      <h3 className="mb-1 text-sm font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-[#4A5A61]">{text}</p>
    </div>
  );
}

function BraceletIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="58" fill="#E4EEEB" />
      <rect x="34" y="46" width="52" height="28" rx="8" stroke="#2C6E5C" strokeWidth="3" fill="white" />
      <rect x="44" y="54" width="12" height="12" fill="#12232E" />
      <rect x="64" y="54" width="12" height="12" fill="#12232E" />
      <path d="M30 60 C24 60 24 46 30 46" stroke="#2C6E5C" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M90 60 C96 60 96 74 90 74" stroke="#2C6E5C" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
