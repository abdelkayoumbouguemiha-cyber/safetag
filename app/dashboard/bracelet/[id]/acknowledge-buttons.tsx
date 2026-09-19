"use client";

import { useState } from "react";
import { acknowledgeScan } from "@/actions/scans";
import type { Locale } from "@/lib/i18n/locale";
import { dashboardTranslations } from "@/lib/i18n/dashboard-translations";

export default function AcknowledgeButtons({
  scanLogId,
  locale,
}: {
  scanLogId: string;
  locale: Locale;
}) {
  const t = dashboardTranslations[locale] ?? dashboardTranslations.ar;
  const [status, setStatus] = useState<"idle" | "acknowledged" | "resolved">("idle");
  const [loading, setLoading] = useState(false);

  async function handleClick(newStatus: "acknowledged" | "resolved") {
    setLoading(true);
    const result = await acknowledgeScan(scanLogId, newStatus);
    setLoading(false);
    if (result.success) {
      setStatus(newStatus);
    }
  }

  if (status === "acknowledged") {
    return <p className="mt-2 text-sm text-brand-green-dark">{t.onMyWay} ✓</p>;
  }
  if (status === "resolved") {
    return <p className="mt-2 text-sm text-brand-green-dark">{t.resolved} ✓</p>;
  }

  return (
    <div className="mt-2 flex gap-2">
      <button
        onClick={() => handleClick("acknowledged")}
        disabled={loading}
        className="rounded-lg bg-brand-green-light/15 px-3 py-1 text-xs font-medium text-brand-green-dark disabled:opacity-50"
      >
        {t.onMyWay}
      </button>
      <button
        onClick={() => handleClick("resolved")}
        disabled={loading}
        className="rounded-lg bg-brand-green px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
      >
        {t.resolved}
      </button>
    </div>
  );
}
