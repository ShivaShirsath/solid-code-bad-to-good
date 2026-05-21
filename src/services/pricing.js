const BASE_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
};

export function getBasePrice(item) {
  return BASE_PRICES[item] ?? 20;
}

export function calculateOrderTotal(user, item, qty) {
  const quantity = Number(qty);
  let total = getBasePrice(item) * quantity;

  if (user === "vip") {
    total *= 0.7;
  } else if (quantity > 10) {
    total *= 0.85;
  }

  return total;
}
