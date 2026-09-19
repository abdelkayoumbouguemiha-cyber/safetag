"use client";

import { useEffect, useId, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  WILAYAS,
  getWilayaByCode,
  searchWilayas,
  type Wilaya,
} from "@/lib/data/wilayas";
import type { Locale } from "@/lib/i18n/locale";

type Props = {
  locale: Locale;
  value: number | null;
  onChange: (code: number | null) => void;
  placeholder: string;
  noMatchText: string;
  invalid?: boolean;
};

function displayName(w: Wilaya, locale: Locale) {
  return locale === "ar" ? w.ar : w.fr;
}

function otherName(w: Wilaya, locale: Locale) {
  return locale === "ar" ? w.fr : w.ar;
}

export default function WilayaSelect({
  locale,
  value,
  onChange,
  placeholder,
  noMatchText,
  invalid,
}: Props) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [typed, setTyped] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const selected = value !== null ? getWilayaByCode(value) : undefined;
  const inputValue = typed ? query : selected ? displayName(selected, locale) : "";
  const results = typed ? searchWilayas(query) : WILAYAS;

  function choose(w: Wilaya) {
    onChange(w.code);
    setTyped(false);
    setQuery("");
    setOpen(false);
  }

  function handleInput(text: string) {
    setQuery(text);
    setTyped(true);
    setActive(0);
    setOpen(true);
    if (value !== null) onChange(null);
  }

  function handleBlur() {
    setOpen(false);
    // If the typed text matches exactly one wilaya, select it automatically.
    if (typed && value === null) {
      const list = searchWilayas(query);
      if (list.length === 1) choose(list[0]);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && open && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    document
      .getElementById(`${listId}-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open, listId]);

  return (
    <div className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full rounded-lg border bg-white px-4 py-2.5 text-ink outline-none focus:border-brand-green ${
          invalid ? "border-danger" : "border-line"
        }`}
      />

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-line bg-surface shadow-lg"
        >
          {results.length === 0 && (
            <li className="px-4 py-2.5 text-sm text-ink-muted">{noMatchText}</li>
          )}
          {results.map((w, i) => (
            <li
              key={w.code}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // mousedown (not click) so the input's blur doesn't close the list first
              onMouseDown={(e) => {
                e.preventDefault();
                choose(w);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm ${
                i === active ? "bg-brand-green-light/15" : ""
              }`}
            >
              <span className="text-ink">
                {String(w.code).padStart(2, "0")} · {displayName(w, locale)}
              </span>
              <span className="text-xs text-ink-muted">{otherName(w, locale)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
