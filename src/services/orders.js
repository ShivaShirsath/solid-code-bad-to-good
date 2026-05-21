// SOLID: Single Responsibility - Order management operations only
// Follows: SRP (pure functions for order logic)

export function createOrder(orderData) {
  const { user, item, qty, price, total, payment } = orderData;

  return {
    id: Date.now(),
    user,
    item,
    qty: Number(qty),
    price,
    total,
    payment,
    status: "PLACED",
    createdAt: new Date().toISOString()
  };
}

export function refundOrder(orderId, orders) {
  return orders.map((o) => {
    if (o.id === orderId && o.status !== "REFUNDED") {
      return { ...o, status: "REFUNDED", refundedAt: new Date().toISOString() };
    }
    return o;
  });
}

export function findOrderById(orderId, orders) {
  return orders.find((o) => o.id === orderId);
}

export function getOrdersByUser(user, orders) {
  return orders.filter((o) => o.user === user);
}
