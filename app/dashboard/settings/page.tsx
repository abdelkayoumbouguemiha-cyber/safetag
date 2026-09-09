"use client";

import { useState } from "react";
import { updatePhone } from "@/actions/auth";

export default function SettingsPage() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setStatus("saving");
    setError(null);

    const result = await updatePhone(phone);

    if (result.success) {
      setStatus("saved");
    } else {
      setStatus("error");
      setError(result.message ?? "Something went wrong.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 gap-4">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <p className="text-gray-600 text-center max-w-sm">
        Optionally add a phone number so a finder can contact you directly.
      </p>

      <input
        type="tel"
        placeholder="+213 777 762 416"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border rounded-lg px-4 py-2 w-72"
      />

      <button
        onClick={handleSave}
        disabled={status === "saving" || !phone}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
      >
        {status === "saving" ? "Saving..." : "Save Phone Number"}
      </button>

      {status === "saved" && <p className="text-green-600 text-sm">Saved!</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </main>
  );
}
