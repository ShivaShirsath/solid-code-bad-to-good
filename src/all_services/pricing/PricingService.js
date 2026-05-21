const Prices = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20
};

export function calculatePrice(item, qty) {
  const price = Prices[item] || 0;
  return price * Number(qty);
}