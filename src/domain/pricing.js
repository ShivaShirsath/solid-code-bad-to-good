/**
 * Pricing domain — item catalogue and discount rules.
 *
 * OCP: add new items or discount strategies here without touching
 * any other module.
 */

const ITEM_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20,
};

/**
 * Returns the base unit price for an item.
 * Throws if the item is unknown so callers get an explicit error.
 */
export function getBasePrice(item) {
  const price = ITEM_PRICES[item];
  if (price === undefined) throw new Error(`Unknown item: ${item}`);
  return price;
}

/**
 * Discount rules evaluated in order; first match wins.
 * Each rule is { label, matches(user, qty), factor }.
 *
 * OCP: append a new rule object here — nothing else changes.
 */
const DISCOUNT_RULES = [
  {
    label: "VIP 30% off",
    matches: (user) => user === "vip",
    factor: 0.7,
  },
  {
    label: "Bulk 15% off (qty > 10)",
    matches: (_user, qty) => qty > 10,
    factor: 0.85,
  },
];

/**
 * Returns the discount factor (0–1) that applies to this order,
 * or 1.0 if no discount applies.
 */
export function getDiscountFactor(user, qty) {
  const rule = DISCOUNT_RULES.find((r) => r.matches(user, qty));
  return rule ? rule.factor : 1.0;
}

/**
 * Calculates the final order total.
 */
export function calculateTotal(item, qty, user) {
  const base = getBasePrice(item);
  const factor = getDiscountFactor(user, qty);
  return base * qty * factor;
}
