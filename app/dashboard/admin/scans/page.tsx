import Link from "next/link";
import { getAllScansDetailed } from "@/actions/admin";

export default async function ScansDetailPage() {
  const { scans } = await getAllScansDetailed();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/dashboard/admin"
        className="text-sm text-ink-muted hover:text-ink"
      >
        → رجوع للعمليات
      </Link>

      <h1 className="mt-4 mb-1 font-display text-2xl font-semibold tracking-tight text-ink">
        السكانات
      </h1>
      <p className="mb-8 text-sm text-ink-muted">
        آخر {scans.length} سكان مسجل
      </p>

      <ul className="border border-line bg-surface">
        {scans.map((s, i) => {
          const bracelet = s.children_bracelets as unknown as {
            child_first_name: string | null;
          } | null;
          return (
            <li
              key={s.id}
              className={`px-5 py-4 ${i > 0 ? "border-t border-line" : ""}`}
            >
              <p className="text-sm text-ink">
                {bracelet?.child_first_name ?? (
                  <span className="text-ink-muted">سوار غير معروف</span>
                )}
              </p>
              <p
                className="mt-1 text-xs text-ink-muted"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {new Date(s.created_at).toLocaleString()} · IP: {s.ip_address}{" "}
                · {s.consent_given ? "الموقع مُشارك" : "بلا موقع"}
              </p>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
