"use client";

import { useState } from "react";
import { generateBraceletCodes } from "@/actions/admin";

export default function GenerateCodesForm() {
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [ids, setIds] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setIds(null);

    const result = await generateBraceletCodes(count);
    setLoading(false);

    if (result.success && result.ids) {
      setIds(result.ids);
    } else {
      setError(result.message ?? "حدث خطأ ما.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-muted">العدد</span>
          <input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-24 border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green-dark"
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </label>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="border border-brand-green-dark bg-brand-green-dark px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "جارِ التوليد…" : "توليد"}
        </button>
      </div>

      {error && (
        <p className="border-r-2 border-danger pr-3 text-sm text-danger">
          {error}
        </p>
      )}

      {ids && (
        <div className="border-r-2 border-brand-green-dark pr-3">
          <p className="mb-2 text-sm text-brand-green-dark">
            تم توليد {ids.length} كود{ids.length === 1 ? "" : "اً"}
          </p>
          <textarea
            readOnly
            value={ids.join("\n")}
            rows={6}
            dir="ltr"
            className="w-full border border-line bg-bg p-3 text-xs text-ink outline-none"
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </div>
      )}
    </div>
  );
}
