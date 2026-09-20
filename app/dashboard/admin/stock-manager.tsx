"use client";

import { useState } from "react";
import { updateColorStock } from "@/actions/admin";

type Color = {
  code: string;
  name_ar: string;
  hex: string;
  stock: number;
};

export default function StockManager({ colors: initialColors }: { colors: Color[] }) {
  const [colors, setColors] = useState(initialColors);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingCode, setSavingCode] = useState<string | null>(null);

  async function handleSave(code: string) {
    const raw = drafts[code];
    const newStock = Number(raw);

    if (raw === undefined || !Number.isInteger(newStock) || newStock < 0) {
      return;
    }

    setSavingCode(code);
    const result = await updateColorStock(code, newStock);
    if (result.success) {
      setColors((prev) =>
        prev.map((c) => (c.code === code ? { ...c, stock: newStock } : c))
      );
      setDrafts((prev) => {
        const updated = { ...prev };
        delete updated[code];
        return updated;
      });
    }
    setSavingCode(null);
  }

  return (
    <ul className="border border-line bg-surface">
      {colors.map((color, i) => {
        const draft = drafts[color.code];
        const hasDraft = draft !== undefined && Number(draft) !== color.stock;

        return (
          <li
            key={color.code}
            className={`flex items-center gap-4 px-5 py-3 ${i > 0 ? "border-t border-line" : ""}`}
          >
            <span
              className="h-5 w-5 shrink-0 rounded-full border border-line"
              style={{ backgroundColor: color.hex }}
              aria-hidden
            />
            <span className="flex-1 text-sm text-ink">{color.name_ar}</span>
            <span
              className={`text-xs ${color.stock <= 5 ? "text-danger" : "text-ink-muted"}`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              الحالي: {color.stock}
            </span>
            <input
              type="number"
              min={0}
              placeholder={String(color.stock)}
              value={draft ?? ""}
              onChange={(e) =>
                setDrafts((prev) => ({ ...prev, [color.code]: e.target.value }))
              }
              className="w-20 rounded-lg border border-line bg-white px-2 py-1.5 text-sm text-ink outline-none focus:border-brand-green"
              style={{ fontFamily: "var(--font-mono)" }}
            />
            <button
              onClick={() => handleSave(color.code)}
              disabled={!hasDraft || savingCode === color.code}
              className="whitespace-nowrap rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brand-green-dark disabled:opacity-40"
            >
              {savingCode === color.code ? "جارِ الحفظ…" : "حفظ"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
