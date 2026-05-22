// SRP: Only responsible for order creation and mutation logic.
// The component no longer builds order objects or maps over arrays inline.

export function createOrder(user, item, qty, total) {
  return {
    id: Date.now(),
    user,
    item,
    qty: Number(qty),
    total,
    status: "PLACED",
  };
}

export function refundOrder(orders, orderId) {
  return orders.map((o) =>
    o.id === orderId && o.status !== "REFUNDED"
      ? { ...o, status: "REFUNDED" }
      : o
  );
}
