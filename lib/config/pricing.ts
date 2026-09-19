// Single source of truth for order prices (in DZD).
// TODO: set the real bracelet price and delivery fees before launch.
// While unitPrice is 0, the order page shows "confirmed when we call you".
export const PRICING: {
  unitPrice: number;
  deliveryFee: { home: number; desk: number };
} = {
  unitPrice: 0,
  deliveryFee: { home: 0, desk: 0 },
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
