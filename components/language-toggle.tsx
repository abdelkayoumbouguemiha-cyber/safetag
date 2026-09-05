"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { SiteLocale } from "@/lib/i18n/site-translations";

export default function LanguageToggle({ current }: { current: SiteLocale }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function toggle() {
    const next: SiteLocale = current === "ar" ? "fr" : "ar";
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", next);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <button
      onClick={toggle}
      className="text-sm font-medium text-[#5C6B70] hover:text-[#13232D]"
    >
      {current === "ar" ? "Français" : "العربية"}
    </button>
  );
}
