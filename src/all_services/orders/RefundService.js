export function refundOrder(orders, orderId) {
  return orders.map((o) => {
    if (o.id === orderId && o.status !== "REFUNDED") {
      return {
        ...o,
        status: "REFUNDED"
      };
    }

    return o;
  });
}