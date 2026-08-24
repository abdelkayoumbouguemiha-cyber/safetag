import RealtimeListener from "./realtime-listener";
import { createClient } from "@/lib/supabase/server";
import EnablePush from "./enable-push";
import Link from "next/link";
import { listBracelets } from "@/actions/bracelets";
import DeactivateButton from "./deactivate-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { bracelets } = await listBracelets();

  return (
    <main className="flex min-h-screen flex-col p-6 gap-4">
      <h1 className="text-2xl font-bold">Your Bracelets</h1>
      {user && <RealtimeListener guardianId={user.id} />}  
      <EnablePush />
      {bracelets.length === 0 && (
        <p className="text-gray-600">
          You haven&apos;t activated any bracelets yet.
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {bracelets.map((b) => (
          <li key={b.id} className="border rounded-lg p-4 flex justify-between items-center">
            <Link href={`/dashboard/bracelet/${b.id}`}>
              <p className="font-medium">{b.child_first_name}</p>
              <p className="text-sm text-gray-500">Status: {b.status}</p>
            </Link>
            {b.status === "active" && <DeactivateButton braceletId={b.id} />}
          </li>
        ))}
      </ul>
      <Link
        href="/dashboard/settings"
        className="text-blue-600 text-sm text-center"
      >
        Account Settings
      </Link>

      <Link
        href="/dashboard/add-bracelet"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-center"
      >
        + Add Bracelet
      </Link>
    </main>
  );
}
