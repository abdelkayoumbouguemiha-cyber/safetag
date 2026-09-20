"use client";

import { useState, useMemo } from "react";
import { updateOrderStatus, saveOrderAdminNote } from "@/actions/admin";

type ColorBreakdownItem = {
  code: string;
  quantity: number;
};

type Order = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  wilaya_name: string;
  commune: string;
  delivery_type: string;
  address: string | null;
  quantity: number;
  unit_price: number;
  delivery_fee: number;
  status: string;
  customer_note: string | null;
  admin_note: string | null;
  color_breakdown: ColorBreakdownItem[] | null;
};

const STATUS_OPTIONS = [
  { value: "new", label: "جديد" },
  { value: "confirmed", label: "مؤكد" },
  { value: "shipped", label: "تم الشحن" },
  { value: "delivered", label: "تم التسليم" },
  { value: "cancelled", label: "ملغى" },
  { value: "returned", label: "مرتجع" },
] as const;

const STATUS_DOT: Record<string, string> = {
  new: "bg-amber",
  confirmed: "bg-brand-green-light",
  shipped: "bg-brand-green",
  delivered: "bg-brand-green-dark",
  cancelled: "bg-danger",
  returned: "bg-ink-muted",
};

const DELIVERY_LABEL: Record<string, string> = {
  home: "إلى المنزل",
  desk: "إلى مكتب التوصيل",
};

// Arabic display names for color codes — kept in sync with
// supabase/migrations/0006_product_colors.sql. Only used as a fallback
// label; the color dot itself is decorative here since this list doesn't
// fetch product_colors.hex.
const COLOR_LABEL: Record<string, string> = {
  white: "أبيض/كريمي",
  green: "أخضر فاتح",
  pink: "وردي",
  blue: "أزرق فاتح",
  navy: "كحلي",
  yellow: "أصفر",
};

const PAGE_SIZE = 20;

function formatNumber(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function normalizeSearch(text: string): string {
  return text.trim().toLowerCase().replace(/[\s.\-()]/g, "");
}

function formatColorBreakdown(breakdown: ColorBreakdownItem[] | null): string {
  if (!breakdown || breakdown.length === 0) return "";
  return breakdown
    .map((item) => `${COLOR_LABEL[item.code] ?? item.code} ×${item.quantity}`)
    .join("، ");
}

export default function OrdersList({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null);
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    for (const opt of STATUS_OPTIONS) {
      counts[opt.value] = orders.filter((o) => o.status === opt.value).length;
    }
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    const q = normalizeSearch(search);
    if (q) {
      result = result.filter(
        (o) =>
          normalizeSearch(o.full_name).includes(q) ||
          normalizeSearch(o.phone).includes(q)
      );
    }

    return result;
  }, [orders, statusFilter, search]);

  const visibleOrders = filteredOrders.slice(0, visibleCount);
  const hasMore = filteredOrders.length > visibleOrders.length;

  function handleFilterChange(value: string) {
    setStatusFilter(value);
    setVisibleCount(PAGE_SIZE);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  }

  async function handleStatusChange(orderId: string, status: string) {
    setSavingStatusId(orderId);
    const result = await updateOrderStatus(orderId, status);
    if (result.success) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    }
    setSavingStatusId(null);
  }

  async function handleSaveNote(orderId: string) {
    const note = noteDrafts[orderId] ?? "";
    setSavingNoteId(orderId);
    const result = await saveOrderAdminNote(orderId, note);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, admin_note: note.trim() || null } : o))
      );
    }
    setSavingNoteId(null);
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        <FilterPill
          active={statusFilter === "all"}
          onClick={() => handleFilterChange("all")}
          label="الكل"
          count={statusCounts.all}
        />
        {STATUS_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.value}
            active={statusFilter === opt.value}
            onClick={() => handleFilterChange(opt.value)}
            label={opt.label}
            count={statusCounts[opt.value]}
          />
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="ابحث بالاسم أو رقم الهاتف..."
        className="mb-4 w-full max-w-sm rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-green"
      />

      {filteredOrders.length === 0 && (
        <div className="border border-line bg-surface px-5 py-8 text-center text-sm text-ink-muted">
          لا توجد طلبات مطابقة.
        </div>
      )}

      {filteredOrders.length > 0 && (
        <>
          <ul className="border border-line bg-surface">
            {visibleOrders.map((order, i) => {
              const total = order.unit_price * order.quantity + order.delivery_fee;
              const isExpanded = expandedId === order.id;
              const colorsLabel = formatColorBreakdown(order.color_breakdown);

              return (
                <li key={order.id} className={i > 0 ? "border-t border-line" : ""}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="flex w-full items-start gap-4 px-5 py-4 text-right transition-colors hover:bg-bg"
                  >
                    <span
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[order.status] ?? "bg-line"}`}
                      aria-hidden
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-ink">{order.full_name}</p>
                        <p
                          className="text-sm text-brand-green-dark"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {formatNumber(total)} دج
                        </p>
                      </div>
                      <p
                        className="mt-1 text-xs text-ink-muted"
                        style={{ fontFamily: "var(--font-mono)" }}
                        dir="ltr"
                      >
                        {order.phone}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        {order.wilaya_name} · {order.commune} · {DELIVERY_LABEL[order.delivery_type] ?? order.delivery_type}
                      </p>
                      {colorsLabel && (
                        <p className="mt-1 text-xs text-ink">
                          {colorsLabel}
                        </p>
                      )}
                      <p
                        className="mt-1 text-xs text-ink-muted"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {order.id.slice(0, 8)}… · {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-line bg-bg px-5 py-4">
                      <div className="mb-4">
                        <p className="mb-1.5 text-xs font-medium text-ink-muted">الحالة</p>
                        <select
                          value={order.status}
                          disabled={savingStatusId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="w-full max-w-xs rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {colorsLabel && (
                        <div className="mb-4">
                          <p className="mb-1 text-xs font-medium text-ink-muted">الألوان المطلوبة</p>
                          <p className="text-sm text-ink">{colorsLabel}</p>
                        </div>
                      )}

                      {order.address && (
                        <div className="mb-4">
                          <p className="mb-1 text-xs font-medium text-ink-muted">العنوان</p>
                          <p className="text-sm text-ink">{order.address}</p>
                        </div>
                      )}

                      {order.customer_note && (
                        <div className="mb-4">
                          <p className="mb-1 text-xs font-medium text-ink-muted">ملاحظة الزبون</p>
                          <p className="text-sm text-ink">{order.customer_note}</p>
                        </div>
                      )}

                      <div>
                        <p className="mb-1.5 text-xs font-medium text-ink-muted">ملاحظة الأدمن</p>
                        <textarea
                          rows={2}
                          value={noteDrafts[order.id] ?? order.admin_note ?? ""}
                          onChange={(e) =>
                            setNoteDrafts((prev) => ({ ...prev, [order.id]: e.target.value }))
                          }
                          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
                        />
                        <button
                          onClick={() => handleSaveNote(order.id)}
                          disabled={savingNoteId === order.id}
                          className="mt-2 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brand-green-dark disabled:opacity-50"
                        >
                          {savingNoteId === order.id ? "جارِ الحفظ…" : "حفظ الملاحظة"}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {hasMore && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="rounded-lg border border-line bg-surface px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-brand-green-dark"
              >
                عرض المزيد ({filteredOrders.length - visibleOrders.length} متبقي)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-brand-green-dark bg-brand-green-dark text-white"
          : "border-line bg-surface text-ink-muted hover:border-brand-green"
      }`}
    >
      {label}
      <span
        className="mr-1.5 opacity-80"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {count}
      </span>
    </button>
  );
}
