"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { activateBracelet } from "@/actions/bracelets";
import QrScanner from "qr-scanner";
import type { Locale } from "@/lib/i18n/locale";
import { dashboardTranslations } from "@/lib/i18n/dashboard-translations";

function extractCodeFromScan(raw: string): string {
  const match = raw.match(/scan\/([a-f0-9-]{36})/i);
  return match ? match[1] : raw.trim();
}

export default function AddBraceletPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    const match = document.cookie.match(/safetag_lang=(ar|fr|en)/);
    if (match) setLocale(match[1] as Locale);
  }, []);

  const t = dashboardTranslations[locale] ?? dashboardTranslations.ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    return () => {
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
    };
  }, []);

  async function startScanning() {
    setError(null);
    setScanning(true);

    setTimeout(async () => {
      if (!videoRef.current) return;

      try {
        const scanner = new QrScanner(
          videoRef.current,
          (result) => {
            setCode(extractCodeFromScan(result.data));
            stopScanning();
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: "environment",
          }
        );
        scannerRef.current = scanner;
        await scanner.start();
      } catch {
        setError(t.cameraError);
        setScanning(false);
      }
    }, 0);
  }

  function stopScanning() {
    scannerRef.current?.stop();
    scannerRef.current?.destroy();
    scannerRef.current = null;
    setScanning(false);
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const result = await activateBracelet(code, name);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message ?? t.genericError);
    }
  }

  return (
    <main dir={dir} className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg p-6">
      <h1 className="font-display text-2xl font-semibold text-brand-green-dark">{t.activateTitle}</h1>

      {scanning ? (
        <div className="flex w-full max-w-sm flex-col items-center gap-3">
          <video
            ref={videoRef}
            className="w-full rounded-2xl border border-line"
          />
          <button
            onClick={stopScanning}
            className="text-sm text-ink-muted underline underline-offset-4"
          >
            {t.cancelScan}
          </button>
        </div>
      ) : (
        <button
          onClick={startScanning}
          className="flex items-center gap-2 rounded-xl border border-brand-green px-6 py-3 font-medium text-brand-green-dark transition-colors hover:bg-brand-green hover:text-white"
        >
          {t.scanQr}
        </button>
      )}

      <p className="text-sm text-ink-muted">{t.orManualEntry}</p>

      <input
        type="text"
        placeholder={t.activationCodePlaceholder}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-72 rounded-lg border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-brand-green"
      />

      <input
        type="text"
        placeholder={t.childNamePlaceholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-72 rounded-lg border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-brand-green"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !code || !name}
        className="w-72 rounded-xl bg-brand-green px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark disabled:opacity-50"
      >
        {loading ? t.activating : t.activate}
      </button>

      {error && <p className="text-sm text-danger">{error}</p>}
    </main>
  );
}
