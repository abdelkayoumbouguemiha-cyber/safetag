import { getScanHistory } from "@/actions/scans";
import { createClient } from "@/lib/supabase/server";
import AcknowledgeButtons from "./acknowledge-buttons";
import ShareContactButton from "./share-contact-button";
import { getLocale } from "@/lib/i18n/locale";
import { dashboardTranslations } from "@/lib/i18n/dashboard-translations";

export default async function BraceletDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const locale = await getLocale();
  const t = dashboardTranslations[locale] ?? dashboardTranslations.ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const { data: { user } } = await supabase.auth.getUser();

  const { data: bracelet } = await supabase
    .from("children_bracelets")
    .select("child_first_name, status, guardian_id")
    .eq("id", id)
    .single();

  if (!bracelet || bracelet.guardian_id !== user?.id) {
    return (
      <main dir={dir} className="flex min-h-screen flex-col items-center justify-center bg-bg p-6">
        <p className="text-ink-muted">{t.notFoundBracelet}</p>
      </main>
    );
  }

  const { data: guardian } = await supabase
    .from("guardians")
    .select("phone")
    .eq("id", user!.id)
    .single();

  const hasPhone = !!guardian?.phone;

  const { scans } = await getScanHistory(id);

  const statusLabel =
    bracelet.status === "active" ? t.statusActive :
    bracelet.status === "unactivated" ? t.statusUnactivated : t.statusInactive;

  return (
    <main dir={dir} className="min-h-screen bg-bg px-6 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-2xl font-semibold text-brand-green-dark">
          {bracelet?.child_first_name}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {t.status}: {statusLabel}
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold text-ink">{t.recentScans}</h2>

        {scans.length === 0 && (
          <p className="text-sm text-ink-muted">{t.noScansYet}</p>
        )}

        <ul className="flex flex-col gap-3">
          {scans.map((scan) => (
            <li key={scan.id} className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm text-ink-muted">
                {new Date(scan.created_at).toLocaleString()}
              </p>

              {scan.consent_given && scan.approx_lat && scan.approx_lng && (
                <a
                  href={`https://www.google.com/maps?q=${scan.approx_lat},${scan.approx_lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-green-dark underline underline-offset-4 hover:text-brand-green"
                >
                  📍 {t.openInMaps}
                </a>
              )}

              <AcknowledgeButtons scanLogId={scan.id} locale={locale} />

              <div className="mt-2">
                <ShareContactButton
                  scanLogId={scan.id}
                  locale={locale}
                  initiallyShared={scan.contact_shared}
                  hasPhone={hasPhone}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
