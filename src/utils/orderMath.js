// Pure order math helpers live here so business rules can be reused and tested easily.
// SOLID: Single Responsibility - calculations are not mixed with UI or infra code.
export const ITEM_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20
};

export function getItemPrice(item) {
  return ITEM_PRICES[item] ?? ITEM_PRICES.misc;
}

export function applyDiscount(total, user, qty) {
  if (user === "vip") return total * 0.7;
  if (Number(qty) > 10) return total * 0.85;
  return total;
}

export function calculateRevenue(orders) {
  return orders.reduce((acc, order) => (order.status !== "REFUNDED" ? acc + order.total : acc), 0);
}