"use client";

import { useState } from "react";
import { markFlagReviewed } from "@/actions/admin";

type Flag = {
  id: string;
  bracelet_id: string;
  reason: string;
  reviewed: boolean;
  created_at: string;
};

export default function FlaggedScansList({ flags }: { flags: Flag[] }) {
  const [localFlags, setLocalFlags] = useState(flags);

  async function handleReview(flagId: string) {
    await markFlagReviewed(flagId);
    setLocalFlags((prev) =>
      prev.map((f) => (f.id === flagId ? { ...f, reviewed: true } : f))
    );
  }

  if (localFlags.length === 0) {
    return (
      <div className="border border-line bg-surface px-5 py-8 text-center text-sm text-ink-muted">
        لا توجد سكانات معلّمة حالياً.
      </div>
    );
  }

  return (
    <ul className="border border-line bg-surface">
      {localFlags.map((flag, i) => (
        <li
          key={flag.id}
          className={`flex items-start gap-4 px-5 py-4 ${
            i > 0 ? "border-t border-line" : ""
          } ${flag.reviewed ? "opacity-50" : ""}`}
        >
          <span
            className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
              flag.reviewed ? "bg-line" : "bg-amber"
            }`}
            aria-hidden
          />
          <div className="flex-1">
            <p className="text-sm text-ink">{flag.reason}</p>
            <p
              className="mt-1 text-xs text-ink-muted"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {flag.bracelet_id.slice(0, 8)}… ·{" "}
              {new Date(flag.created_at).toLocaleString()}
            </p>
          </div>
          {!flag.reviewed && (
            <button
              onClick={() => handleReview(flag.id)}
              className="shrink-0 whitespace-nowrap border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brand-green-dark"
            >
              تمّت المراجعة
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
