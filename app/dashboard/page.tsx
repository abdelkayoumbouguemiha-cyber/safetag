import RealtimeListener from "./realtime-listener";
import { createClient } from "@/lib/supabase/server";
import EnablePush from "./enable-push";
import Link from "next/link";
import { listBracelets } from "@/actions/bracelets";
import DeactivateButton from "./deactivate-button";

const statusStyles: Record<string, { dot: string; label: string }> = {
  active: { dot: "bg-brand-green", label: "نشط" },
  unactivated: { dot: "bg-line", label: "غير مفعّل" },
  inactive: { dot: "bg-danger", label: "غير نشط" },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { bracelets } = await listBracelets();

  return (
    <main className="min-h-screen bg-bg px-6 py-8">
      <div className="mx-auto max-w-md">
        {user && <RealtimeListener guardianId={user.id} />}

        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-muted">SafeTag</p>
            <h1 className="font-display text-2xl font-semibold text-brand-green-dark">أساوركم</h1>
          </div>
          <EnablePush />
        </header>

        {bracelets.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
            <p className="text-ink-muted">لم تفعّلوا أي سوار بعد.</p>
          </div>
        )}

        <ul className="flex flex-col gap-3">
          {bracelets.map((b) => {
            const style = statusStyles[b.status] ?? statusStyles.unactivated;
            return (
              <li
                key={b.id}
                className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <Link href={`/dashboard/bracelet/${b.id}`} className="flex-1">
                  <p className="font-medium text-ink">{b.child_first_name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                    <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                    {style.label}
                  </p>
                </Link>
                {b.status === "active" && <DeactivateButton braceletId={b.id} />}
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dashboard/add-bracelet"
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark"
          >
            + إضافة سوار
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-center text-sm text-ink-muted hover:text-brand-green-dark"
          >
            إعدادات الحساب
          </Link>
        </div>
      </div>
    </main>
  );
}
