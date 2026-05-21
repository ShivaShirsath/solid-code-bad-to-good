export function getUnitPrice(item) {
  const priceMap = {
    laptop: 1000,
    phone: 500,
    headset: 50,
    misc: 20,
  };
  return priceMap[item] ?? 20;
}

export function calculateTotal({ item, qty, user }) {
  const unit = getUnitPrice(item);
  let total = unit * Number(qty);

  if (user === "vip") total *= 0.7;
  else if (Number(qty) > 10) total *= 0.85;

  return { unitPrice: unit, total };
}
