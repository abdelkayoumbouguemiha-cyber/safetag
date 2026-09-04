import Link from "next/link";
import { getAllScansDetailed } from "@/actions/admin";

export default async function ScansDetailPage() {
  const { scans } = await getAllScansDetailed();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/dashboard/admin"
        className="text-sm text-[#5C6B70] hover:text-[#13232D]"
      >
        ← Back to Operations
      </Link>

      <h1 className="mt-4 mb-1 text-2xl font-semibold tracking-tight">
        Scans
      </h1>
      <p className="mb-8 text-sm text-[#5C6B70]">
        Most recent {scans.length} scans logged
      </p>

      <ul className="border border-[#DCE1DF] bg-white">
        {scans.map((s, i) => {
          const bracelet = s.children_bracelets as unknown as {
            child_first_name: string | null;
          } | null;
          return (
            <li
              key={s.id}
              className={`px-5 py-4 ${i > 0 ? "border-t border-[#DCE1DF]" : ""}`}
            >
              <p className="text-sm">
                {bracelet?.child_first_name ?? (
                  <span className="text-[#5C6B70]">Unknown bracelet</span>
                )}
              </p>
              <p
                className="mt-1 text-xs text-[#5C6B70]"
                style={{ fontFamily: "var(--font-plex-mono)" }}
              >
                {new Date(s.created_at).toLocaleString()} · IP: {s.ip_address}{" "}
                · {s.consent_given ? "location shared" : "no location"}
              </p>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
