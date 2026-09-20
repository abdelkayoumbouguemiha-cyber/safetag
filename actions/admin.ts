"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// TEMPORARY: hardcoded admin check for solo-founder stage.
// Replace with a proper admin role/table before onboarding a team.
const ADMIN_USER_ID = "1bfef704-5c8c-49c5-8ee1-0c9ba374946d";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== ADMIN_USER_ID) {
    throw new Error("Not authorized");
  }
}

export async function generateBraceletCodes(count: number) {
  await requireAdmin();

  if (count < 1 || count > 1000) {
    return { success: false, message: "Count must be between 1 and 1000." };
  }

  const admin = createAdminClient();

  const rows = Array.from({ length: count }, () => ({
    status: "unactivated" as const,
  }));

  const { data, error } = await admin
    .from("children_bracelets")
    .insert(rows)
    .select("id");

  if (error || !data) {
    return { success: false, message: "Could not generate codes." };
  }

  return { success: true, ids: data.map((d) => d.id) };
}

export async function getAdminStats() {
  await requireAdmin();

  const admin = createAdminClient();

  const { count: total } = await admin
    .from("children_bracelets")
    .select("*", { count: "exact", head: true });

  const { count: activated } = await admin
    .from("children_bracelets")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: scanned } = await admin
    .from("scan_logs")
    .select("*", { count: "exact", head: true });

  const { count: newOrders } = await admin
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  return {
    total: total ?? 0,
    activated: activated ?? 0,
    scanned: scanned ?? 0,
    newOrders: newOrders ?? 0,
  };
}
export async function getFlaggedScans() {
  await requireAdmin();

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("flagged_scans")
    .select("id, bracelet_id, reason, reviewed, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return { flags: [] };
  return { flags: data };
}

export async function markFlagReviewed(flagId: string) {
  await requireAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from("flagged_scans")
    .update({ reviewed: true })
    .eq("id", flagId);

  return { success: !error };
}
export async function getUnactivatedBracelets() {
  await requireAdmin();

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("children_bracelets")
    .select("id, created_at")
    .eq("status", "unactivated")
    .order("created_at", { ascending: false });

  if (error) return { bracelets: [] };
  return { bracelets: data };
}
export async function getAllBraceletsDetailed() {
  await requireAdmin();

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("children_bracelets")
    .select("id, child_first_name, status, guardian_id, created_at, activated_at")
    .order("created_at", { ascending: false });

  if (error) return { bracelets: [] };
  return { bracelets: data };
}

export async function getAllScansDetailed() {
  await requireAdmin();

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("scan_logs")
    .select("id, bracelet_id, ip_address, consent_given, created_at, children_bracelets(child_first_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return { scans: [] };
  return { scans: data };
}

// ---- Orders management (cash-on-delivery) ----

const ORDER_STATUSES = [
  "new",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getOrders() {
  await requireAdmin();

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("orders")
    .select(
      "id, created_at, full_name, phone, wilaya_name, commune, delivery_type, address, quantity, unit_price, delivery_fee, status, customer_note, admin_note, color_breakdown"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return { orders: [] };
  return { orders: data };
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();

  if (!UUID_RE.test(orderId)) return { success: false };
  if (!ORDER_STATUSES.includes(status as OrderStatus)) return { success: false };

  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  return { success: !error };
}

export async function saveOrderAdminNote(orderId: string, note: string) {
  await requireAdmin();

  if (!UUID_RE.test(orderId)) return { success: false };

  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({
      admin_note: note.trim().slice(0, 1000) || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  return { success: !error };
}

// ---- Product colors / stock management ----

export async function getProductColorsAdmin() {
  await requireAdmin();

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("product_colors")
    .select("code, name_ar, hex, stock")
    .order("sort_order", { ascending: true });

  if (error) return { colors: [] };
  return { colors: data };
}

export async function updateColorStock(code: string, newStock: number) {
  await requireAdmin();

  if (!Number.isInteger(newStock) || newStock < 0 || newStock > 100000) {
    return { success: false };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("product_colors")
    .update({ stock: newStock, updated_at: new Date().toISOString() })
    .eq("code", code);

  return { success: !error };
}
