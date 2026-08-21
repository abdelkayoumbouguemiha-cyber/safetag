"use client";

import { useState } from "react";
import { translations, type Locale } from "@/lib/i18n/translations";

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
      <div className="text-center">
        <p className="text-green-600 font-medium">{t.notified}</p>
        {hotline && <p className="text-sm text-gray-500 mt-2">{t.hotlineNote(hotline)}</p>}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <p className="text-red-600 font-medium">{t.somethingWrong}</p>
        {hotline && <p className="text-sm text-gray-500 mt-2">{t.callDirectly(hotline)}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "sending"}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
    >
      {status === "sending" ? t.notifying : t.notifyButton}
    </button>
  );
}
