/**
 * pricingService.js
 *
 * S — Single Responsibility: only knows about prices and discounts.
 * O — Open/Closed: add a new item or discount rule by extending the
 *     ITEM_PRICES map or DISCOUNT_RULES array — no existing code changes.
 */

// Extend this map to support new items without touching any other file.
const ITEM_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20,
};

/**
 * Each rule is a predicate + multiplier.
 * Rules are evaluated in order; the first match wins.
 * Add new discount rules here without touching buyNow or any component.
 */
const DISCOUNT_RULES = [
  { matches: ({ userType }) => userType === "vip", multiplier: 0.7 },
  { matches: ({ qty }) => qty > 10, multiplier: 0.85 },
];

/**
 * Returns the base unit price for an item.
 * @param {string} itemName
 * @returns {number}
 */
export function getItemPrice(itemName) {
  return ITEM_PRICES[itemName] ?? 20;
}

/**
 * Calculates the final total after applying the first matching discount.
 * @param {{ itemName: string, qty: number, userType: string }} params
 * @returns {number}
 */
export function calculateTotal({ itemName, qty, userType }) {
  const base = getItemPrice(itemName) * qty;
  const rule = DISCOUNT_RULES.find((r) => r.matches({ userType, qty }));
  return rule ? base * rule.multiplier : base;
}
