import { notFound } from "next/navigation";
import ScanForm from "./scan-form";

async function getBraceletInfo(code: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/bracelet/${code}`,
    { cache: "no-store" }
  );

  if (res.status === 404) return { notFound: true as const };
  if (res.status === 410) return { inactive: true as const };
  if (!res.ok) return { error: true as const };

  const data = await res.json();
  return { childFirstName: data.child_first_name as string };
}

export default async function ScanPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const result = await getBraceletInfo(code);

  if ("notFound" in result || "error" in result) {
    notFound();
  }

  if ("inactive" in result) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-semibold">This bracelet is no longer active.</h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center gap-4">
      <h1 className="text-2xl font-bold">
        This child may be lost — {result.childFirstName}
      </h1>
      <p className="text-gray-600">
        Tap below to notify their guardian right away.
      </p>
      <ScanForm code={code} />
    </main>
  );
}
