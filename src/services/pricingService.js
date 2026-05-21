const PRICES = {
  laptop:  1000,
  phone:   500,
  headset: 50,
  misc:    20,
};

export function getBasePrice(item) {
  return PRICES[item] ?? 20;
}

export function applyDiscounts(total, { user, qty }) {
  if (user === "vip") return total * 0.7;
  if (qty > 10)       return total * 0.85;
  return total;
}

export function calculateTotal(item, qty, user) {
  const base = getBasePrice(item);
  const raw  = base * Number(qty);
  return applyDiscounts(raw, { user, qty: Number(qty) });
}