export function basePrice(item) {
  const map = {
    laptop: 1000,
    phone: 500,
    headset: 50,
    misc: 20
  };
  return map[item] ?? 20;
}

export function calculateTotal({ item, qty }, discountMultiplierFn) {
  const price = basePrice(item);
  const subtotal = price * Number(qty);
  const multiplier = typeof discountMultiplierFn === 'function' ? discountMultiplierFn({ item, qty }) : 1;
  return subtotal * multiplier;
}
