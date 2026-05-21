export const ITEM_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20,
};

export function getItemPrice(item) {
  return ITEM_PRICES[item] ?? 20;
}
