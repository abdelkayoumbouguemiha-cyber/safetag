"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deactivateBracelet } from "@/actions/bracelets";
import { requestReauthOtp, confirmReauthOtp } from "@/actions/auth";
import type { Locale } from "@/lib/i18n/locale";
import { dashboardTranslations } from "@/lib/i18n/dashboard-translations";

export default function DeactivateButton({
  braceletId,
  locale,
}: {
  braceletId: string;
  locale: Locale;
}) {
  const t = dashboardTranslations[locale] ?? dashboardTranslations.ar;
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "otp" | "loading">("idle");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setError(null);
    setStep("loading");
    const result = await requestReauthOtp();

    if (result.success) {
      setStep("otp");
    } else {
      setError(result.message ?? t.genericError);
      setStep("idle");
    }
  }

  async function handleConfirm() {
    setError(null);
    setStep("loading");

    const otpResult = await confirmReauthOtp(otp);
    if (!otpResult.success || !otpResult.confirmationId) {
      setError(t.invalidCode);
      setStep("otp");
      return;
    }

    const result = await deactivateBracelet(braceletId, otpResult.confirmationId);
    if (result.success) {
      router.refresh();
      setStep("idle");
      setOtp("");
    } else {
      setError(result.message ?? t.genericError);
      setStep("otp");
    }
  }

  if (step === "idle") {
    return (
      <button
        onClick={handleStart}
        className="shrink-0 text-xs font-medium text-danger hover:underline"
      >
        {t.deactivate}
      </button>
    );
  }

  if (step === "loading") {
    return <span className="shrink-0 text-xs text-ink-muted">...</span>;
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-2">
      <p className="text-xs text-ink-muted">{t.enterConfirmCode}</p>
      <input
        type="text"
        placeholder="123456"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-24 rounded-lg border border-line px-2 py-1 text-sm outline-none focus:border-danger"
      />
      <button
        onClick={handleConfirm}
        disabled={!otp}
        className="text-xs font-medium text-danger hover:underline disabled:opacity-50"
      >
        {t.confirmDeactivate}
      </button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
