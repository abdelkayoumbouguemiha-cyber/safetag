"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { requestOtp, verifyOtp } from "@/actions/auth";
import { loginTranslations } from "@/lib/i18n/site-translations";
import type { Locale } from "@/lib/i18n/locale";
import LanguageToggle from "@/components/language-toggle";

export default function LoginPage() {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>("ar");

  // اللغة تُقرأ من الكوكي فالمتصفح (client-side) عند تحميل الصفحة،
  // خاطر هاذي الصفحة "use client" وما تقدرش تستعمل getLocale() السيرفر مباشرة.
  useEffect(() => {
    const match = document.cookie.match(/safetag_lang=(ar|fr|en)/);
    if (match) setLocaleState(match[1] as Locale);
  }, []);

  const t = loginTranslations[locale] ?? loginTranslations.ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRequestOtp() {
    setLoading(true);
    setError(null);
    const result = await requestOtp(email);
    setLoading(false);

    if (result.success) {
      setStep("otp");
    } else {
      setError(result.message ?? "حدث خطأ ما.");
    }
  }

  async function handleVerifyOtp() {
    setLoading(true);
    setError(null);
    const result = await verifyOtp(email, otp);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message ?? "الكود غير صحيح.");
    }
  }

  return (
    <main dir={dir} className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12">
      <div className="absolute top-6 right-6">
        <LanguageToggle current={locale} />
      </div>

      <div className="mb-8 flex flex-col items-center gap-3">
        <Image src="/brand/logo.jpeg" alt="SafeTag" width={64} height={64} className="rounded-2xl shadow-sm" />
        <h1 className="font-display text-xl font-semibold text-brand-green-dark">{t.title}</h1>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <StepDot active />
          <div className={`h-0.5 flex-1 rounded-full ${step === "otp" ? "bg-brand-green" : "bg-line"}`} />
          <StepDot active={step === "otp"} />
        </div>

        {step === "email" && (
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder={t.phonePlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-ink outline-none transition-colors focus:border-brand-green focus:ring-2 focus:ring-brand-green-light/30"
            />
            <button
              onClick={handleRequestOtp}
              disabled={loading || !email}
              className="w-full rounded-lg bg-brand-green px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark disabled:opacity-50"
            >
              {loading ? t.sending : t.sendCode}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink-muted">
              {t.enterCode} <span className="font-medium text-ink">{email}</span>
            </p>
            <input
              type="text"
              placeholder={t.codePlaceholder}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-center text-lg tracking-widest text-ink outline-none transition-colors focus:border-brand-green focus:ring-2 focus:ring-brand-green-light/30"
              style={{ fontFamily: "var(--font-mono)" }}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading || !otp}
              className="w-full rounded-lg bg-brand-green px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark disabled:opacity-50"
            >
              {loading ? t.verifying : t.verify}
            </button>
          </div>
        )}

        {error && <p className="mt-4 text-center text-sm text-danger">{error}</p>}
      </div>

      <p className="mt-6 max-w-xs text-center text-xs text-ink-muted">
        بياناتكم محمية ولا تُشارك مع أي طرف ثالث
      </p>
    </main>
  );
}

function StepDot({ active }: { active: boolean }) {
  return (
    <span
      className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors ${
        active ? "bg-brand-green" : "bg-line"
      }`}
    />
  );
}
