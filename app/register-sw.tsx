"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("Service worker registered"))
        .catch((err) => console.error("Service worker registration failed:", err));
    }
  }, []);

  return null;
}
