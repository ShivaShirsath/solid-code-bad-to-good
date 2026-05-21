export function createOrder({ user, item, qty, total }) {
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
  return orders.map((order) =>
    order.id === orderId && order.status !== "REFUNDED"
      ? { ...order, status: "REFUNDED" }
      : order
  );
}

export function calculateRevenue(orders) {
  return orders
    .filter((order) => order.status !== "REFUNDED")
    .reduce((sum, order) => sum + order.total, 0);
}
