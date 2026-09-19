"use client";

import { useState } from "react";
import { translations } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locale";

export default function ScanForm({ code, locale }: { code: string; locale: Locale }) {
  const t = translations[locale];
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [hotline, setHotline] = useState<string | null>(null);

  async function handleClick() {
    setStatus("sending");

    let lat: number | undefined;
    let lng: number | undefined;
    let consent = false;

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      consent = true;
    } catch {
      consent = false;
    }

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, consent_location: consent, lat, lng }),
      });

      const data = await res.json();
      setHotline(data.fallback_hotline ?? null);
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-2">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-light/20 text-2xl text-brand-green-dark">
          ✓
        </span>
        <p className="font-medium text-brand-green-dark">{t.notified}</p>
        {hotline && <p className="text-sm text-ink-muted">{t.hotlineNote(hotline)}</p>}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <p className="font-medium text-danger">{t.somethingWrong}</p>
        {hotline && <p className="mt-2 text-sm text-ink-muted">{t.callDirectly(hotline)}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "sending"}
      className="w-full rounded-xl bg-brand-green px-6 py-4 text-base font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark disabled:opacity-50"
    >
      {status === "sending" ? t.notifying : t.notifyButton}
    </button>
  );
}
