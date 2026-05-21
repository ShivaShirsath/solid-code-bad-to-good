export const PRODUCTS = {
  laptop: { name: "Laptop", basePrice: 1000 },
  phone: { name: "Phone", basePrice: 500 },
  headset: { name: "Headset", basePrice: 50 },
  misc: { name: "Miscellaneous", basePrice: 20 }
};

/**
 * Gets the base price for a given product item key.
 * If product is not found, defaults to 20.
 * @param {string} sku 
 * @returns {number}
 */
export function getProductPrice(sku) {
  const product = PRODUCTS[sku];
  return product ? product.basePrice : 20;
}
