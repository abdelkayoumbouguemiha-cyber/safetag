import Link from "next/link";
import { getOrders } from "@/actions/admin";
import OrdersList from "./orders-list";

export default async function OrdersPage() {
  const { orders } = await getOrders();

  const newCount = orders.filter((o) => o.status === "new").length;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/dashboard/admin" className="text-sm text-ink-muted hover:text-ink">
        → رجوع للعمليات
      </Link>

      <div className="mt-4 mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            الطلبات
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {orders.length} طلب إجمالاً
          </p>
        </div>
        {newCount > 0 && (
          <span className="flex items-center gap-2 rounded-full bg-amber-soft px-3 py-1.5 text-sm font-medium text-amber">
            <span className="h-2 w-2 rounded-full bg-amber" />
            {newCount} طلب{newCount === 1 ? "" : "ات"} جديد{newCount === 1 ? "" : "ة"}
          </span>
        )}
      </div>

      <OrdersList orders={orders} />
    </main>
  );
}
