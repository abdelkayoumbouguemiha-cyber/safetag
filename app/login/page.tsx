"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestOtp, verifyOtp } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 gap-4">
      <h1 className="text-2xl font-bold">SafeTag Login</h1>

      {step === "phone" && (
        <>
          <input
            type="tel"
            placeholder="213777762416"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded-lg px-4 py-2 w-64"
          />
          <button
            onClick={handleRequestOtp}
            disabled={loading || !phone}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Code"}
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <p className="text-gray-600">Enter the code sent to {phone}</p>
          <input
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border rounded-lg px-4 py-2 w-64"
          />
          <button
            onClick={handleVerifyOtp}
            disabled={loading || !otp}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </main>
  );
}
