"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimitedDb } from "@/lib/rate-limit-db";
import { orderSchema } from "@/lib/validation/order";
import { getWilayaByCode } from "@/lib/data/wilayas";
import { computeTotals } from "@/lib/config/pricing";

export type CreateOrderResult =
  | { success: true; orderNumber: string }
  | { success: false; error: "validation"; field: string }
  | { success: false; error: "rate_limited" | "server" };

const HOUR_MS = 60 * 60 * 1000;

// Same trust model as /api/scan: x-vercel-forwarded-for is set by Vercel
// and can't be spoofed by the client. x-forwarded-for is used in dev only.
async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const trusted = h.get("x-vercel-forwarded-for");
  const devFallback =
    process.env.NODE_ENV === "development" ? h.get("x-forwarded-for") : null;
  const ip = (trusted ?? devFallback)?.split(",")[0]?.trim();
  // orders.ip_address is an inet column: store only plausible values.
  return ip && /^[0-9a-fA-F:.]+$/.test(ip) ? ip : null;
}

export async function createOrder(input: unknown): Promise<CreateOrderResult> {
  // 1) Validate everything on the server; never trust the browser.
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    const field = String(parsed.error.issues[0]?.path[0] ?? "form");
    return { success: false, error: "validation", field };
  }
  const data = parsed.data;

  // 2) Honeypot: bots fill the hidden field. Pretend success, save nothing.
  if (data.website && data.website.trim() !== "") {
    return {
      success: true,
      orderNumber: crypto.randomUUID().slice(0, 8).toUpperCase(),
    };
  }

  // 3) Rate limits: per IP and per phone number.
  const ip = await getClientIp();
  if (await isRateLimitedDb(`order-ip-${ip ?? "unknown"}`, 5, HOUR_MS)) {
    return { success: false, error: "rate_limited" };
  }
  if (await isRateLimitedDb(`order-phone-${data.phone}`, 3, HOUR_MS)) {
    return { success: false, error: "rate_limited" };
  }

  // 4) Prices are computed on the server only.
  const wilaya = getWilayaByCode(data.wilaya_code);
  if (!wilaya) {
    return { success: false, error: "validation", field: "wilaya_code" };
  }
  const totals = computeTotals(data.delivery_type, data.quantity);

  // 5) Save with the service-role client (orders has no public RLS policies).
  try {
    const admin = createAdminClient();
    const { data: order, error } = await admin
      .from("orders")
      .insert({
        full_name: data.full_name,
        phone: data.phone,
        wilaya_code: data.wilaya_code,
        wilaya_name: wilaya.ar,
        commune: data.commune,
        delivery_type: data.delivery_type,
        address: data.address || null,
        quantity: data.quantity,
        unit_price: totals.unitPrice,
        delivery_fee: totals.deliveryFee,
        customer_note: data.customer_note || null,
        ip_address: ip,
      })
      .select("id")
      .single();

    if (error || !order) {
      console.error("createOrder insert error:", error?.message);
      return { success: false, error: "server" };
    }

    return { success: true, orderNumber: order.id.slice(0, 8).toUpperCase() };
  } catch (err) {
    console.error("createOrder error:", err instanceof Error ? err.message : err);
    return { success: false, error: "server" };
  }
}
