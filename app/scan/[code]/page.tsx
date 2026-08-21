import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ScanForm from "./scan-form";
import { translations, detectLocale } from "@/lib/i18n/translations";

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
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { code } = await params;
  const { lang } = await searchParams;
  const result = await getBraceletInfo(code);

  const headersList = await headers();
  const locale =
    (lang as keyof typeof translations) ??
    detectLocale(headersList.get("accept-language"));
  const t = translations[locale] ?? translations.en;
  const dir = locale === "ar" ? "rtl" : "ltr";

  if ("notFound" in result || "error" in result) {
    notFound();
  }

  if ("inactive" in result) {
    return (
      <main dir={dir} className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-semibold">{t.inactiveBracelet}</h1>
      </main>
    );
  }

  return (
    <main dir={dir} className="flex min-h-screen flex-col items-center justify-center p-6 text-center gap-4">
      <h1 className="text-2xl font-bold">{t.lostChild(result.childFirstName)}</h1>
      <p className="text-gray-600">{t.tapToNotify}</p>
      <ScanForm code={code} locale={locale} />
    </main>
  );
}
