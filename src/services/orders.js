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
  return orders.map((order) => {
    if (order.id === orderId && order.status !== "REFUNDED") {
      return { ...order, status: "REFUNDED" };
    }

    return order;
  });
}
