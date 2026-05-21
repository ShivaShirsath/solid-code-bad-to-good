// Handles order creation and refund logic
export function createOrder({ user, item, qty, total }) {
  return {
    id: Date.now(),
    user,
    item,
    qty: Number(qty),
    total,
    status: "PLACED"
  };
}

export function refundOrder(orders, orderId) {
  return orders.map((o) => {
    if (o.id === orderId && o.status !== "REFUNDED") {
      return { ...o, status: "REFUNDED" };
    }
    return o;
  });
}
