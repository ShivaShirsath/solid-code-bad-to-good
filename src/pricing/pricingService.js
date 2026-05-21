// SRP: Only responsible for calculating prices and discounts.
// OCP: Add new items or discount rules by extending ITEM_PRICES / discount logic,
//      not by editing buyNow() in the UI component.

const ITEM_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20,
};

export function getBasePrice(item) {
  return ITEM_PRICES[item] ?? 20;
}

export function applyDiscount(total, user, qty) {
  if (user === "vip") return total * 0.7;
  if (qty > 10) return total * 0.85;
  return total;
}

export function calculateTotal(item, qty, user) {
  const base = getBasePrice(item);
  const raw = base * qty;
  return applyDiscount(raw, user, qty);
}
