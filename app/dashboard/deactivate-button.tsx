"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deactivateBracelet } from "@/actions/bracelets";

export default function DeactivateButton({ braceletId }: { braceletId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this bracelet?"
    );
    if (!confirmed) return;

    setLoading(true);
    const result = await deactivateBracelet(braceletId);
    setLoading(false);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.message ?? "Something went wrong.");
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-red-600 text-sm font-medium disabled:opacity-50"
    >
      {loading ? "..." : "Deactivate"}
    </button>
  );
}
