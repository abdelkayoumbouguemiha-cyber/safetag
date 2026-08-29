import { getScanHistory } from "@/actions/scans";
import { createClient } from "@/lib/supabase/server";
import AcknowledgeButtons from "./acknowledge-buttons";

export default async function BraceletDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: bracelet } = await supabase
    .from("children_bracelets")
    .select("child_first_name, status, guardian_id")
    .eq("id", id)
    .single();

  // Explicit ownership check — the public RLS policy (for the finder
  // flow) would otherwise let any authenticated user view this data.
  if (!bracelet || bracelet.guardian_id !== user?.id) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <p className="text-gray-600">Bracelet not found.</p>
      </main>
    );
  }

  const { scans } = await getScanHistory(id);

  return (
    <main className="flex min-h-screen flex-col p-6 gap-4">
      <h1 className="text-2xl font-bold">{bracelet?.child_first_name}</h1>
      <p className="text-sm text-gray-500">Status: {bracelet?.status}</p>

      <h2 className="text-lg font-semibold mt-4">Recent Scans</h2>

      {scans.length === 0 && (
        <p className="text-gray-600 text-sm">No scans yet.</p>
      )}

      <ul className="flex flex-col gap-3">
        {scans.map((scan) => (
          <li key={scan.id} className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              {new Date(scan.created_at).toLocaleString()}
            </p>
            {scan.consent_given && scan.approx_lat && scan.approx_lng && (
              <p className="text-xs text-gray-400">
                Location: {scan.approx_lat.toFixed(3)}, {scan.approx_lng.toFixed(3)}
              </p>
            )}
            <AcknowledgeButtons scanLogId={scan.id} />
          </li>
        ))}
      </ul>
    </main>
  );
}
