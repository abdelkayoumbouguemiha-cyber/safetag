"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/actions/locale";
import type { Locale } from "@/lib/i18n/locale";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "ar", label: "ع" },
  { value: "fr", label: "Fr" },
  { value: "en", label: "En" },
];

export default function LanguageToggle({ current }: { current: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSelect(locale: Locale) {
    if (locale === current) return;

    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-line bg-surface p-0.5 text-xs">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleSelect(opt.value)}
          disabled={isPending}
          className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
            current === opt.value
              ? "bg-brand-green text-white"
              : "text-ink-muted hover:text-ink"
          } disabled:opacity-50`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
