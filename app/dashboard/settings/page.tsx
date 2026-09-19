"use client";

import { useState } from "react";
import { updatePhone } from "@/actions/auth";

export default function SettingsPage() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setStatus("saving");
    setError(null);

    const result = await updatePhone(phone);

    if (result.success) {
      setStatus("saved");
    } else {
      setStatus("error");
      setError(result.message ?? "حدث خطأ ما.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg p-6">
      <h1 className="font-display text-2xl font-semibold text-brand-green-dark">إعدادات الحساب</h1>
      <p className="max-w-sm text-center text-ink-muted">
        أضيفوا رقم هاتف (اختياري) ليتمكن الشخص الذي يجد طفلكم من التواصل معكم مباشرة.
      </p>

      <input
        type="tel"
        placeholder="+213 777 762 416"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-72 rounded-lg border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-brand-green"
        dir="ltr"
      />

      <button
        onClick={handleSave}
        disabled={status === "saving" || !phone}
        className="w-72 rounded-xl bg-brand-green px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark disabled:opacity-50"
      >
        {status === "saving" ? "جارِ الحفظ..." : "حفظ رقم الهاتف"}
      </button>

      {status === "saved" && <p className="text-sm text-brand-green-dark">تم الحفظ!</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
    </main>
  );
}
