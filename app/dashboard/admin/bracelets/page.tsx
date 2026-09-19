import Link from "next/link";
import { getAllBraceletsDetailed } from "@/actions/admin";

const statusColor: Record<string, string> = {
  active: "bg-brand-green-dark",
  inactive: "bg-danger",
  unactivated: "bg-line",
};

const statusLabel: Record<string, string> = {
  active: "نشط",
  inactive: "غير نشط",
  unactivated: "غير مفعّل",
};

export default async function BraceletsDetailPage() {
  const { bracelets } = await getAllBraceletsDetailed();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/dashboard/admin"
        className="text-sm text-ink-muted hover:text-ink"
      >
        → رجوع للعمليات
      </Link>

      <h1 className="mt-4 mb-1 font-display text-2xl font-semibold tracking-tight text-ink">
        الأساور
      </h1>
      <p className="mb-8 text-sm text-ink-muted">
        {bracelets.length} إجمالاً، كل الحالات
      </p>

      <ul className="border border-line bg-surface">
        {bracelets.map((b, i) => (
          <li
            key={b.id}
            className={`flex items-center gap-4 px-5 py-4 ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${statusColor[b.status] ?? "bg-line"}`}
              aria-hidden
            />
            <div className="flex-1">
              <p className="text-sm text-ink">
                {b.child_first_name ?? (
                  <span className="text-ink-muted">غير معيّن</span>
                )}
              </p>
              <p
                className="mt-1 text-xs text-ink-muted"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {b.id.slice(0, 8)}… · {statusLabel[b.status] ?? b.status} ·{" "}
                {new Date(b.created_at).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
