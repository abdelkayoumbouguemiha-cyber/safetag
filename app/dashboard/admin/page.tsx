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
      <header className="mb-8 flex items-end justify-between border-b border-[#DCE1DF] pb-6">
        <div>
          <p className="text-sm text-[#5C6B70]">SafeTag</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Operations
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#5C6B70]">
          <span
            className={`h-2 w-2 rounded-full ${
              unreviewedCount > 0 ? "bg-[#A6672A]" : "bg-[#2C6E5C]"
            }`}
            aria-hidden
          />
          {unreviewedCount > 0
            ? `${unreviewedCount} scan${unreviewedCount === 1 ? "" : "s"} need review`
            : "All clear"}
        </div>
      </header>

      <section className="mb-10 grid grid-cols-3 divide-x divide-[#DCE1DF] border border-[#DCE1DF] bg-white">
        <StatCell label="Bracelets" value={stats.total} href="/dashboard/admin/bracelets" />
        <StatCell label="Activated" value={stats.activated} href="/dashboard/admin/bracelets" />
        <StatCell label="Scans logged" value={stats.scanned} href="/dashboard/admin/scans" />
      </section>

      <section className="mb-10">
        <h2 className="mb-1 text-base font-semibold">Bracelet codes</h2>
        <p className="mb-4 text-sm text-[#5C6B70]">
          Generate new codes, then print them for the next production batch.
        </p>
        <div className="border border-[#DCE1DF] bg-white p-5">
          <GenerateCodesForm />
          <div className="mt-4 border-t border-[#DCE1DF] pt-4">
            <Link
              href="/dashboard/admin/print-codes"
              className="text-sm font-medium underline decoration-[#DCE1DF] decoration-2 underline-offset-4 hover:decoration-[#13232D]"
            >
              Print unactivated codes
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="text-base font-semibold">Safety review</h2>
          <span
            className="text-xs text-[#5C6B70]"
            style={{ fontFamily: "var(--font-plex-mono)" }}
          >
            {unreviewedCount} unreviewed
          </span>
        </div>
        <p className="mb-4 text-sm text-[#5C6B70]">
          Scans flagged for unusual patterns — repeated attempts or scans
          from several locations in a short window.
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
    <Link href={href} className="block px-5 py-5 transition-colors hover:bg-[#F6F7F6]">
      <p
        className="text-3xl font-medium"
        style={{ fontFamily: "var(--font-plex-mono)" }}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-[#5C6B70]">{label}</p>
    </Link>
  );
}
