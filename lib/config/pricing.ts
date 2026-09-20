// Single source of truth for order prices (in DZD).
export const PRICING: {
  unitPrice: number;
  deliveryFee: { home: number; desk: number };
} = {
  unitPrice: 1200,
  deliveryFee: { home: 500, desk: 300 },
};

export type DeliveryType = "home" | "desk";

export function computeTotals(deliveryType: DeliveryType, quantity: number) {
  const unitPrice = PRICING.unitPrice;
  const deliveryFee = PRICING.deliveryFee[deliveryType];
  return {
    unitPrice,
    deliveryFee,
    total: unitPrice * quantity + deliveryFee,
  };
}
