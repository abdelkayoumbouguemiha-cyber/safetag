import Link from "next/link";
import { getAllBraceletsDetailed } from "@/actions/admin";

const statusColor: Record<string, string> = {
  active: "bg-[#2C6E5C]",
  inactive: "bg-[#8C3B33]",
  unactivated: "bg-[#DCE1DF]",
};

export default async function BraceletsDetailPage() {
  const { bracelets } = await getAllBraceletsDetailed();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/dashboard/admin"
        className="text-sm text-[#5C6B70] hover:text-[#13232D]"
      >
        ← Back to Operations
      </Link>

      <h1 className="mt-4 mb-1 text-2xl font-semibold tracking-tight">
        Bracelets
      </h1>
      <p className="mb-8 text-sm text-[#5C6B70]">
        {bracelets.length} total, all statuses
      </p>

      <ul className="border border-[#DCE1DF] bg-white">
        {bracelets.map((b, i) => (
          <li
            key={b.id}
            className={`flex items-center gap-4 px-5 py-4 ${
              i > 0 ? "border-t border-[#DCE1DF]" : ""
            }`}
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${statusColor[b.status] ?? "bg-[#DCE1DF]"}`}
              aria-hidden
            />
            <div className="flex-1">
              <p className="text-sm">
                {b.child_first_name ?? (
                  <span className="text-[#5C6B70]">Unassigned</span>
                )}
              </p>
              <p
                className="mt-1 text-xs text-[#5C6B70]"
                style={{ fontFamily: "var(--font-plex-mono)" }}
              >
                {b.id.slice(0, 8)}… · {b.status} ·{" "}
                {new Date(b.created_at).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
