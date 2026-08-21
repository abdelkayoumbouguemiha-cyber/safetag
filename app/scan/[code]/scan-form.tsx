"use client";

import { useState } from "react";

export default function ScanForm({ code }: { code: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleClick() {
    setStatus("sending");
    // POST /api/scan will be wired in next step
    setStatus("sent");
  }

  if (status === "sent") {
    return <p className="text-green-600 font-medium">Guardian notified!</p>;
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "sending"}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
    >
      {status === "sending" ? "Notifying..." : "Notify Guardian"}
    </button>
  );
}
