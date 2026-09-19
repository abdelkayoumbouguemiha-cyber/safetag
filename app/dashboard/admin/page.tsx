import Link from "next/link";
import { getAdminStats, getFlaggedScans } from "@/actions/admin";
import GenerateCodesForm from "./generate-codes-form";
import FlaggedScansList from "./flagged-scans-list";

export default async function AdminPage() {
  const stats = await getAdminStats();
  const { flags } = await getFlaggedScans();
  const unreviewedCount = flags.filter((f) => !f.reviewed).length;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8 flex items-end justify-between border-b border-line pb-6">
        <div>
          <p className="text-sm text-ink-muted">SafeTag</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
            العمليات
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <span
            className={`h-2 w-2 rounded-full ${
              unreviewedCount > 0 ? "bg-amber" : "bg-brand-green-dark"
            }`}
            aria-hidden
          />
          {unreviewedCount > 0
            ? `${unreviewedCount} سكان${unreviewedCount === 1 ? "" : "ات"} بحاجة لمراجعة`
            : "كل شيء تمام"}
        </div>
      </header>

      <section className="mb-10 grid grid-cols-3 divide-x divide-line border border-line bg-surface">
        <StatCell label="الأساور" value={stats.total} href="/dashboard/admin/bracelets" />
        <StatCell label="مفعّلة" value={stats.activated} href="/dashboard/admin/bracelets" />
        <StatCell label="سكانات مسجلة" value={stats.scanned} href="/dashboard/admin/scans" />
      </section>

      <section className="mb-10">
        <h2 className="mb-1 text-base font-semibold text-ink">أكواد الأساور</h2>
        <p className="mb-4 text-sm text-ink-muted">
          ولّد أكواد جديدة، وبعدها اطبعها للدفعة الإنتاجية الجاية.
        </p>
        <div className="border border-line bg-surface p-5">
          <GenerateCodesForm />
          <div className="mt-4 border-t border-line pt-4">
            <Link
              href="/dashboard/admin/print-codes"
              className="text-sm font-medium text-brand-green-dark underline decoration-line decoration-2 underline-offset-4 hover:decoration-brand-green"
            >
              طباعة الأكواد الغير مفعّلة
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-ink">مراجعة السلامة</h2>
          <span
            className="text-xs text-ink-muted"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {unreviewedCount} غير مراجعة
          </span>
        </div>
        <p className="mb-4 text-sm text-ink-muted">
          سكانات مُعلّمة بأنماط غير اعتيادية — محاولات متكررة أو سكانات من عدة مواقع فوقت قصير.
        </p>
        <FlaggedScansList flags={flags} />
      </section>
    </main>
  );
}

function StatCell({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link href={href} className="block px-5 py-5 transition-colors hover:bg-bg">
      <p
        className="text-3xl font-medium text-ink"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </Link>
  );
}
