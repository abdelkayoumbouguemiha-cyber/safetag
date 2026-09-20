"use client";

import { useState } from "react";
import { shareScanContact } from "@/actions/scans";
import type { Locale } from "@/lib/i18n/locale";
import { dashboardTranslations } from "@/lib/i18n/dashboard-translations";

export default function ShareContactButton({
  scanLogId,
  locale,
  initiallyShared,
  hasPhone,
}: {
  scanLogId: string;
  locale: Locale;
  initiallyShared: boolean;
  hasPhone: boolean;
}) {
  const t = dashboardTranslations[locale] ?? dashboardTranslations.ar;
  const [shared, setShared] = useState(initiallyShared);
  const [loading, setLoading] = useState(false);

  if (shared) {
    return <p className="text-xs text-brand-green-dark">{t.phoneShared}</p>;
  }

  if (!hasPhone) {
    return <p className="text-xs text-ink-muted">{t.noPhoneOnFile}</p>;
  }

  async function handleShare() {
    setLoading(true);
    const result = await shareScanContact(scanLogId);
    setLoading(false);
    if (result.success) {
      setShared(true);
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      className="text-xs font-medium text-brand-green-dark underline underline-offset-4 hover:text-brand-green disabled:opacity-50"
    >
      {loading ? "..." : t.sharePhone}
    </button>
  );
}
