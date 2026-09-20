"use client";

import { useState, useEffect } from "react";
import { updatePhone } from "@/actions/auth";
import type { Locale } from "@/lib/i18n/locale";
import { dashboardTranslations } from "@/lib/i18n/dashboard-translations";
import DeleteAccountButton from "./delete-account-button";

export default function SettingsPage() {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    const match = document.cookie.match(/safetag_lang=(ar|fr|en)/);
    if (match) setLocaleState(match[1] as Locale);
  }, []);

  const t = dashboardTranslations[locale] ?? dashboardTranslations.ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

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
      setError(result.message ?? t.genericError);
    }
  }

  return (
    <main dir={dir} className="flex min-h-screen flex-col items-center gap-4 bg-bg p-6 pt-16">
      <h1 className="font-display text-2xl font-semibold text-brand-green-dark">{t.settingsTitle}</h1>
      <p className="max-w-sm text-center text-ink-muted">
        {t.settingsDescription}
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
        {status === "saving" ? t.saving : t.savePhone}
      </button>

      {status === "saved" && <p className="text-sm text-brand-green-dark">{t.saved}</p>}
      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="mt-10 w-full max-w-sm border-t border-line pt-8">
        <h2 className="mb-1 text-base font-semibold text-danger">{t.dangerZoneTitle}</h2>
        <p className="mb-4 text-sm text-ink-muted">{t.dangerZoneDescription}</p>
        <DeleteAccountButton locale={locale} />
      </div>
    </main>
  );
}
