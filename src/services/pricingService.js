export const ITEM_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20
};

export function calculatePrice(item, qty) {
  return (ITEM_PRICES[item] ?? ITEM_PRICES.misc) * Number(qty);
}

export function applyDiscounts(total, user, qty) {
  if (user === "vip") return total * 0.7;
  if (Number(qty) > 10) return total * 0.85;
  return total;
}

export function calculateOrderTotal({ item, qty, user }) {
  const base = calculatePrice(item, qty);
  return applyDiscounts(base, user, qty);
}
