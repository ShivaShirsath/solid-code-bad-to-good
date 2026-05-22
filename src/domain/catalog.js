export const CATALOG_PRICES = Object.freeze({
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20
});

export function getItemPrice(item) {
  return CATALOG_PRICES[item] ?? CATALOG_PRICES.misc;
}
