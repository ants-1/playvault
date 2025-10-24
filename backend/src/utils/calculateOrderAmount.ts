export const calculateOrderAmount = (
  details: { price: number; quantity: number }[]
): number => {
  return details.reduce(
    (total: number, item: { price: number; quantity: number }) =>
      total + item.price * item.quantity,
    0
  );
};
