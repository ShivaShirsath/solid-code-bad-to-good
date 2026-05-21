import { getProductPrice } from "./products";
import { ACTIVE_DISCOUNT_STRATEGIES } from "./discountStrategy";

/**
 * Calculates the total order price based on product base price and applicable discounts.
 * Maintains OCP by working with polymorphic discount strategies.
 * 
 * @param {string} sku - Product identifier
 * @param {number} qty - Quantity purchased
 * @param {string} user - Username or role
 * @returns {number} The final calculated order price
 */
export function calculateOrderPrice(sku, qty, user) {
  const quantity = Number(qty) || 0;
  const basePrice = getProductPrice(sku);
  const subtotal = basePrice * quantity;

  // Filter and sort strategies by priority (descending)
  const applicableStrategies = ACTIVE_DISCOUNT_STRATEGIES
    .filter(strategy => strategy.shouldApply(user, quantity, subtotal))
    .sort((a, b) => b.priority - a.priority);

  // Apply the highest-priority discount strategy if any are applicable
  if (applicableStrategies.length > 0) {
    return applicableStrategies[0].apply(subtotal);
  }

  return subtotal;
}
