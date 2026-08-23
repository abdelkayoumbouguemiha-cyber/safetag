"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deactivateBracelet } from "@/actions/bracelets";
import { requestReauthOtp, confirmReauthOtp } from "@/actions/auth";

export default function DeactivateButton({ braceletId }: { braceletId: string }) {
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
      setError(result.message ?? "Something went wrong.");
      setStep("idle");
    }
  }

  async function handleConfirm() {
    setError(null);
    setStep("loading");

    const otpResult = await confirmReauthOtp(otp);
    if (!otpResult.success) {
      setError("Invalid code.");
      setStep("otp");
      return;
    }

    const result = await deactivateBracelet(braceletId);
    if (result.success) {
      router.refresh();
      setStep("idle");
      setOtp("");
    } else {
      setError(result.message ?? "Something went wrong.");
      setStep("otp");
    }
  }

  if (step === "idle") {
    return (
      <button
        onClick={handleStart}
        className="text-red-600 text-sm font-medium"
      >
        Deactivate
      </button>
    );
  }

  if (step === "loading") {
    return <span className="text-sm text-gray-500">...</span>;
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      <p className="text-xs text-gray-500">Enter the code sent to confirm</p>
      <input
        type="text"
        placeholder="123456"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border rounded px-2 py-1 text-sm w-24"
      />
      <button
        onClick={handleConfirm}
        disabled={!otp}
        className="text-red-600 text-sm font-medium disabled:opacity-50"
      >
        Confirm Deactivate
      </button>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
