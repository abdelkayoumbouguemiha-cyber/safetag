import { z } from "zod";
import { getWilayaByCode } from "@/lib/data/wilayas";

// Accepts 0555123456, 0555 12 34 56, +213555123456, 00213555123456
export function normalizePhone(raw: string): string {
  let p = raw.replace(/[\s.\-()]/g, "");
  if (p.startsWith("+213")) p = "0" + p.slice(4);
  else if (p.startsWith("00213")) p = "0" + p.slice(5);
  return p;
}

const colorBreakdownItemSchema = z.object({
  code: z.string().min(1).max(20),
  quantity: z.number().int().min(1),
});

export const orderSchema = z
  .object({
    full_name: z.string().trim().min(3).max(100),
    phone: z
      .string()
      .transform(normalizePhone)
      .pipe(z.string().regex(/^0[5-7][0-9]{8}$/)),
    wilaya_code: z
      .number()
      .int()
      .refine((c) => getWilayaByCode(c) !== undefined),
    commune: z.string().trim().min(2).max(100),
    delivery_type: z.enum(["home", "desk"]),
    address: z.string().trim().max(250).optional(),
    quantity: z.number().int().min(1).max(20),
    color_breakdown: z.array(colorBreakdownItemSchema).min(1).max(6),
    customer_note: z.string().trim().max(500).optional(),
    // Honeypot: real users never see this field, bots fill it in.
    website: z.string().optional(),
  })
  .refine(
    (d) =>
      d.delivery_type !== "home" || (d.address !== undefined && d.address.length >= 5),
    { path: ["address"], message: "address_required" }
  )
  .refine(
    (d) => d.color_breakdown.reduce((sum, c) => sum + c.quantity, 0) === d.quantity,
    { path: ["color_breakdown"], message: "color_breakdown_mismatch" }
  );

export type OrderInput = z.infer<typeof orderSchema>;
