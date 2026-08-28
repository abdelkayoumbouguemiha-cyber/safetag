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

  const unreviewed = localFlags.filter((f) => !f.reviewed);

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-semibold">Flagged Scans ({unreviewed.length} unreviewed)</h2>

      {localFlags.length === 0 && (
        <p className="text-sm text-gray-500">No flagged scans.</p>
      )}

      <ul className="flex flex-col gap-2">
        {localFlags.map((flag) => (
          <li
            key={flag.id}
            className={`border rounded p-3 text-sm ${flag.reviewed ? "opacity-50" : ""}`}
          >
            <p className="font-mono text-xs text-gray-400">{flag.bracelet_id}</p>
            <p>{flag.reason}</p>
            <p className="text-xs text-gray-400">
              {new Date(flag.created_at).toLocaleString()}
            </p>
            {!flag.reviewed && (
              <button
                onClick={() => handleReview(flag.id)}
                className="text-xs text-blue-600 mt-1"
              >
                Mark as reviewed
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
