import { getAdminStats, getFlaggedScans } from "@/actions/admin";
import GenerateCodesForm from "./generate-codes-form";
import FlaggedScansList from "./flagged-scans-list";

export default async function AdminPage() {
  const stats = await getAdminStats();
  const { flags } = await getFlaggedScans();

  return (
    <main className="flex min-h-screen flex-col p-6 gap-6">
      <h1 className="text-2xl font-bold">Admin</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-gray-500">Total bracelets</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats.activated}</p>
          <p className="text-sm text-gray-500">Activated</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats.scanned}</p>
          <p className="text-sm text-gray-500">Total scans</p>
        </div>
      </div>

      <GenerateCodesForm />
      <FlaggedScansList flags={flags} />
    </main>
  );
}
