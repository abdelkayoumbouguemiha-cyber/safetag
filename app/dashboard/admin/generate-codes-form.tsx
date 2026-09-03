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
      setError(result.message ?? "Something went wrong.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-[#5C6B70]">Count</span>
          <input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-24 border border-[#DCE1DF] bg-white px-3 py-2 text-sm focus:border-[#13232D] focus:outline-none"
            style={{ fontFamily: "var(--font-plex-mono)" }}
          />
        </label>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="border border-[#13232D] bg-[#13232D] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0B171F] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>

      {error && (
        <p className="border-l-2 border-[#8C3B33] pl-3 text-sm text-[#8C3B33]">
          {error}
        </p>
      )}

      {ids && (
        <div className="border-l-2 border-[#2C6E5C] pl-3">
          <p className="mb-2 text-sm text-[#2C6E5C]">
            {ids.length} code{ids.length === 1 ? "" : "s"} generated
          </p>
          <textarea
            readOnly
            value={ids.join("\n")}
            rows={6}
            className="w-full border border-[#DCE1DF] bg-[#F6F7F6] p-3 text-xs focus:outline-none"
            style={{ fontFamily: "var(--font-plex-mono)" }}
          />
        </div>
      )}
    </div>
  );
}
