"use client";

import { useState, useEffect, useRef } from "react";
import { translations } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locale";

export default function ScanForm({ code, locale }: { code: string; locale: Locale }) {
  const t = translations[locale] ?? translations.ar;
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [hotline, setHotline] = useState<string | null>(null);
  const [scanLogId, setScanLogId] = useState<string | null>(null);
  const [guardianPhone, setGuardianPhone] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll for up to ~10 minutes after notifying, in case the guardian
  // shares their phone number a bit later. Stops as soon as it's shared.
  useEffect(() => {
    if (!scanLogId || guardianPhone) return;

    let attempts = 0;
    const maxAttempts = 120; // 120 * 5s = 10 minutes

    pollRef.current = setInterval(async () => {
      attempts += 1;
      if (attempts > maxAttempts) {
        if (pollRef.current) clearInterval(pollRef.current);
        return;
      }

      try {
        const res = await fetch(`/api/scan/${scanLogId}/status`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.contact_shared && data.phone) {
          setGuardianPhone(data.phone);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // ignore transient network errors, keep polling
      }
    }, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [scanLogId, guardianPhone]);

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
      if (data.scan_log_id) setScanLogId(data.scan_log_id);
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

        {guardianPhone && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-sm text-brand-green-dark">{t.guardianSharedPhone}</p>
            <a
              href={`tel:${guardianPhone}`}
              dir="ltr"
              className="rounded-xl bg-brand-green px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark"
            >
              {t.callGuardian}
            </a>
          </div>
        )}
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
