"use client";

import { useState, useEffect } from "react";
import { savePushSubscription } from "@/actions/push";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function EnablePush() {
  const [status, setStatus] = useState<"idle" | "enabled" | "denied" | "unsupported">("idle");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
    }
  }, []);

  async function handleEnable() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      const json = subscription.toJSON();
      await savePushSubscription({
        endpoint: json.endpoint!,
        keys: { p256dh: json.keys!.p256dh, auth: json.keys!.auth },
      });

      setStatus("enabled");
    } catch (err) {
      console.error("Push subscription error:", err);
      setStatus("denied");
    }
  }

  if (status === "unsupported") return null;
  if (status === "enabled") {
    return <p className="text-sm text-green-600">Push notifications enabled ✓</p>;
  }

  return (
    <button
      onClick={handleEnable}
      className="text-sm text-blue-600 underline"
    >
      Enable push notifications
    </button>
  );
}
