export function calculateOrderAmount(
  items: { price?: number; quantity?: number }[]
): number {
  if (!items || items.length === 0) return 0;

  let total = 0;

  for (const item of items) {
    if (item.price === undefined) {
      throw new Error("Price is required");
    }

    if (item.quantity === undefined) {
      throw new Error("Quantity is required");
    }

    if (typeof item.price !== "number" || typeof item.quantity !== "number") {
      return NaN;
    }

    total += item.price * item.quantity;
  }

  return total;
}
