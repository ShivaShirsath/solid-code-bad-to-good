// utils/pricing.js

export function calculatePrice(item, qty, user) {

  const prices = {
    laptop: 1000,
    phone: 500,
    headset: 50,
    misc: 20
  };

  let total = prices[item] * qty;

  if (user === "vip") {
    total *= 0.7;
  }
  else if (qty > 10) {
    total *= 0.85;
  }

  return total;
}