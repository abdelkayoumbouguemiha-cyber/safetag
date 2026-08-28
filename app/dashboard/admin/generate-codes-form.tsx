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
    <div className="border rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-semibold">Generate Bracelet Codes</h2>

      <div className="flex gap-2 items-center">
        <input
          type="number"
          min={1}
          max={1000}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="border rounded px-3 py-2 w-24"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {ids && (
        <div>
          <p className="text-sm text-green-600 mb-2">Generated {ids.length} codes:</p>
          <textarea
            readOnly
            value={ids.join("\n")}
            className="w-full h-40 text-xs font-mono border rounded p-2"
          />
        </div>
      )}
    </div>
  );
}
