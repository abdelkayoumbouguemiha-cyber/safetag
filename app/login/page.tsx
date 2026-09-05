"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestOtp, verifyOtp } from "@/actions/auth";
import { loginTranslations, type SiteLocale } from "@/lib/i18n/site-translations";
import LanguageToggle from "@/components/language-toggle";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale: SiteLocale = searchParams.get("lang") === "fr" ? "fr" : "ar";
  const t = loginTranslations[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRequestOtp() {
    setLoading(true);
    setError(null);
    const result = await requestOtp(phone);
    setLoading(false);

    if (result.success) {
      setStep("otp");
    } else {
      setError(result.message ?? "Something went wrong.");
    }
  }

  async function handleVerifyOtp() {
    setLoading(true);
    setError(null);
    const result = await verifyOtp(phone, otp);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message ?? "Invalid code.");
    }
  }

  return (
    <main dir={dir} className="flex min-h-screen flex-col items-center justify-center p-6 gap-4">
      <div className="absolute top-6 right-6">
        <LanguageToggle current={locale} />
      </div>

      <h1 className="text-2xl font-bold">{t.title}</h1>

      {step === "phone" && (
        <>
          <input
            type="tel"
            placeholder={t.phonePlaceholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded-lg px-4 py-2 w-64"
          />
          <button
            onClick={handleRequestOtp}
            disabled={loading || !phone}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? t.sending : t.sendCode}
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <p className="text-gray-600">
            {t.enterCode} {phone}
          </p>
          <input
            type="text"
            placeholder={t.codePlaceholder}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border rounded-lg px-4 py-2 w-64"
          />
          <button
            onClick={handleVerifyOtp}
            disabled={loading || !otp}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? t.verifying : t.verify}
          </button>
        </>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
