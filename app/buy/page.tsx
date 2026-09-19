import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/locale";
import { orderTranslations } from "@/lib/i18n/order-translations";
import LanguageToggle from "@/components/language-toggle";
import OrderForm from "./order-form";

export const metadata: Metadata = {
  title: "SafeTag",
};

export default async function BuyPage() {
  const locale = await getLocale();
  const t = orderTranslations[locale] ?? orderTranslations.ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-bg text-ink">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <Image src="/brand/logo.jpeg" alt="SafeTag" width={32} height={32} className="rounded-lg" />
          SafeTag
        </Link>
        <LanguageToggle current={locale} />
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16">
        <Link href="/" className="text-sm text-ink-muted hover:text-brand-green-dark">
          {t.backHome}
        </Link>
        <h1 className="mt-3 mb-8 font-display text-3xl font-semibold text-brand-green-dark">
          {t.pageTitle}
        </h1>
        <OrderForm locale={locale} />
      </main>
    </div>
  );
}
