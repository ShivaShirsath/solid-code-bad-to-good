const itemPrices = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20,
};

export function getItemPrice(item) {
  return itemPrices[item] ?? itemPrices.misc;
}

export function calculateOrderTotal(item, qty, user) {
  const quantity = Number(qty);
  const price = getItemPrice(item) * quantity;

  if (user === "vip") return price * 0.7;
  if (quantity > 10) return price * 0.85;
  return price;
}

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

export function buildSuccessMessage(order) {
  return `Order ${order.id} placed. Total: ${order.total}`;
}

export function exportOrderReport(orders) {
  let revenue = 0;
  const lines = ["id,user,item,qty,total,status"];

  orders.forEach((order) => {
    if (order.status !== "REFUNDED") revenue += order.total;
    lines.push(`${order.id},${order.user},${order.item},${order.qty},${order.total},${order.status}`);
  });

  return {
    csv: lines.join("\n"),
    revenue,
  };
}
