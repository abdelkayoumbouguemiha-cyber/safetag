"use client";

import { useState } from "react";

export default function ScanForm({ code }: { code: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [hotline, setHotline] = useState<string | null>(null);

  async function handleClick() {
    setStatus("sending");

    // Ask for location permission — optional, non-blocking if denied
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
      // Denied or unavailable — proceed without location, per design
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

      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center">
        <p className="text-green-600 font-medium">Guardian notified!</p>
        {hotline && (
          <p className="text-sm text-gray-500 mt-2">
            If you don't hear back soon, call {hotline}.
          </p>
        )}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <p className="text-red-600 font-medium">Something went wrong.</p>
        {hotline && (
          <p className="text-sm text-gray-500 mt-2">
            Please call {hotline} directly.
          </p>
        )}
      </div>
    );
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
