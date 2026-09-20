"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount, requestReauthOtp, confirmReauthOtp } from "@/actions/auth";
import type { Locale } from "@/lib/i18n/locale";
import { dashboardTranslations } from "@/lib/i18n/dashboard-translations";

export default function DeleteAccountButton({ locale }: { locale: Locale }) {
  const t = dashboardTranslations[locale] ?? dashboardTranslations.ar;
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "confirm" | "otp" | "loading" | "done">("idle");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setStep("confirm");
  }

  async function handleProceedToOtp() {
    setError(null);
    setStep("loading");
    const result = await requestReauthOtp();

    if (result.success) {
      setStep("otp");
    } else {
      setError(result.message ?? t.genericError);
      setStep("confirm");
    }
  }

  async function handleFinalConfirm() {
    setError(null);
    setStep("loading");

    const otpResult = await confirmReauthOtp(otp);
    if (!otpResult.success || !otpResult.confirmationId) {
      setError(t.invalidCode);
      setStep("otp");
      return;
    }

    const result = await deleteAccount(otpResult.confirmationId);
    if (result.success) {
      setStep("done");
      setTimeout(() => {
        router.push("/");
      }, 2500);
    } else {
      setError(result.message ?? t.genericError);
      setStep("otp");
    }
  }

  if (step === "idle") {
    return (
      <button
        onClick={handleStart}
        className="text-sm font-medium text-danger hover:underline"
      >
        {t.deleteAccount}
      </button>
    );
  }

  if (step === "loading") {
    return <p className="text-sm text-ink-muted">...</p>;
  }

  if (step === "done") {
    return <p className="text-sm text-brand-green-dark">{t.accountDeleted}</p>;
  }

  if (step === "confirm") {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4">
        <p className="text-sm text-ink">{t.deleteAccountWarning}</p>
        <div className="flex gap-2">
          <button
            onClick={handleProceedToOtp}
            className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {t.confirmDeleteAccount}
          </button>
          <button
            onClick={() => setStep("idle")}
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:border-ink-muted"
          >
            {locale === "ar" ? "إلغاء" : locale === "fr" ? "Annuler" : "Cancel"}
          </button>
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }

  // step === "otp"
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4">
      <p className="text-sm text-ink-muted">{t.enterConfirmCode}</p>
      <input
        type="text"
        placeholder="123456"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-32 rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-danger"
        style={{ fontFamily: "var(--font-mono)" }}
      />
      <div className="flex gap-2">
        <button
          onClick={handleFinalConfirm}
          disabled={!otp}
          className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {t.confirmDeleteAccount}
        </button>
        <button
          onClick={() => setStep("idle")}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:border-ink-muted"
        >
          {locale === "ar" ? "إلغاء" : locale === "fr" ? "Annuler" : "Cancel"}
        </button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
