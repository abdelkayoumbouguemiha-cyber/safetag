"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { activateBracelet } from "@/actions/bracelets";

export default function AddBraceletPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const result = await activateBracelet(code, name);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message ?? "Something went wrong.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 gap-4">
      <h1 className="text-2xl font-bold">Activate a Bracelet</h1>

      <input
        type="text"
        placeholder="Activation code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border rounded-lg px-4 py-2 w-72"
      />

      <input
        type="text"
        placeholder="Child's first name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-lg px-4 py-2 w-72"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !code || !name}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
      >
        {loading ? "Activating..." : "Activate"}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </main>
  );
}
