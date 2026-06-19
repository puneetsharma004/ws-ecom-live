// Shared, pure checkout math (no secrets). Used by the server to compute the
// authoritative total and by the client only to preview shipping/total.
// All amounts are in paise.

export const FREE_SHIPPING_THRESHOLD = 150000; // ₹1,500
export const FLAT_SHIPPING_FEE = 7900; // ₹79

export function computeShipping(subtotal) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
}

export function computeTotals(subtotal) {
  const shipping = computeShipping(subtotal);
  return { subtotal, shipping, total: subtotal + shipping };
}
