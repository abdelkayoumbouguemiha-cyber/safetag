"use client";

import { QRCodeSVG } from "qrcode.react";

const SITE_URL = "https://safetag-el99-delta.vercel.app";

type Bracelet = {
  id: string;
  created_at: string;
};

export default function PrintGrid({ bracelets }: { bracelets: Bracelet[] }) {
  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h1 className="font-display text-2xl font-semibold text-brand-green-dark">
          طباعة الأكواد ({bracelets.length} غير مفعّل)
        </h1>
        <button
          onClick={() => window.print()}
          className="rounded-xl bg-brand-green px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark"
        >
          طباعة / حفظ كـ PDF
        </button>
      </div>

      {bracelets.length === 0 && (
        <p className="text-ink-muted print:hidden">
          لا توجد أساور غير مفعّلة. ولّد بعض الأكواد أولاً من صفحة الأدمن.
        </p>
      )}

      <div className="grid grid-cols-3 gap-6 print:grid-cols-2">
        {bracelets.map((b) => (
          <div
            key={b.id}
            className="flex flex-col items-center gap-2 break-inside-avoid rounded-2xl border border-line p-4"
          >
            <QRCodeSVG value={`${SITE_URL}/scan/${b.id}`} size={160} />
            <p className="break-all text-center text-xs text-ink" style={{ fontFamily: "var(--font-mono)" }}>
              {b.id}
            </p>
            <p className="text-xs text-ink-muted">SafeTag</p>
          </div>
        ))}
      </div>
    </main>
  );
}
