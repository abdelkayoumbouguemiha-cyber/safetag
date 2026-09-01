"use client";

import { QRCodeSVG } from "qrcode.react";

// Always use the production URL for printed codes — these are meant
// to be scanned by real phones, never localhost.
const SITE_URL = "https://safetag-el99-delta.vercel.app";

type Bracelet = {
  id: string;
  created_at: string;
};

export default function PrintGrid({ bracelets }: { bracelets: Bracelet[] }) {
  return (
    <main className="p-6">
      <div className="print:hidden mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Print Codes ({bracelets.length} unactivated)
        </h1>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          Print / Save as PDF
        </button>
      </div>

      {bracelets.length === 0 && (
        <p className="print:hidden text-gray-500">
          No unactivated bracelets. Generate some first from the admin page.
        </p>
      )}

      <div className="grid grid-cols-3 gap-6 print:grid-cols-2">
        {bracelets.map((b) => (
          <div
            key={b.id}
            className="border rounded-lg p-4 flex flex-col items-center gap-2 break-inside-avoid"
          >
            <QRCodeSVG value={`${SITE_URL}/scan/${b.id}`} size={160} />
            <p className="text-xs font-mono text-center break-all">{b.id}</p>
            <p className="text-xs text-gray-400">SafeTag</p>
          </div>
        ))}
      </div>
    </main>
  );
}
