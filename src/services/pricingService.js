const PRODUCT_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20
};

export function calculatePrice(item, qty, user) {
  const basePrice = PRODUCT_PRICES[item] || 0;

  let total = basePrice * qty;

  // VIP discount
  if (user === "vip") {
    total *= 0.7;
  }

  // Bulk discount
  else if (qty > 10) {
    total *= 0.85;
  }

  return total;
}