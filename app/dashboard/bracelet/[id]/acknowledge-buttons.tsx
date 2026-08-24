"use client";

import { useState } from "react";
import { acknowledgeScan } from "@/actions/scans";

export default function AcknowledgeButtons({ scanLogId }: { scanLogId: string }) {
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
    return <p className="text-sm text-blue-600 mt-2">On my way ✓</p>;
  }
  if (status === "resolved") {
    return <p className="text-sm text-green-600 mt-2">Resolved ✓</p>;
  }

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => handleClick("acknowledged")}
        disabled={loading}
        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded disabled:opacity-50"
      >
        On my way
      </button>
      <button
        onClick={() => handleClick("resolved")}
        disabled={loading}
        className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded disabled:opacity-50"
      >
        Resolved
      </button>
    </div>
  );
}
