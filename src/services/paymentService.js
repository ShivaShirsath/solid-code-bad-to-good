const prices = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20
};

export function calculateTotal(user, item, qty) {
  let total = (prices[item] || 20) * qty;

  if (user === "vip") {
    total *= 0.7;
  } else if (qty > 10) {
    total *= 0.85;
  }

  return total;
}