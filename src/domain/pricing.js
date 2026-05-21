const ITEM_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20,
};

export function getBasePrice(item) {
  return ITEM_PRICES[item] ?? 20;
}

export function applyDiscount(subtotal, user, qty) {
  if (user === "vip") return subtotal * 0.7;
  if (qty > 10) return subtotal * 0.85;
  return subtotal;
}
