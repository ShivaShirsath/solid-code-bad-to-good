// Product catalog could eventually come from a database or API
const ITEM_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20, // Default for unknown/other items
};

const USER_DISCOUNTS = {
  vip: 0.7, // 30% discount
  regular: 1.0,
};

export class PricingService {
  /**
   * Calculates the total price applying base price, quantity, and discount rules.
   */
  static calculateTotal(item, qty, userType) {
    const basePrice = ITEM_PRICES[item] || ITEM_PRICES.misc;
    let total = basePrice * Number(qty);

    // Apply user tier discount
    const userDiscount = USER_DISCOUNTS[userType] || USER_DISCOUNTS.regular;
    total *= userDiscount;

    // Apply bulk discount if applicable, and user wasn't a VIP
    // The original logic was:
    // if (user === "vip") total *= 0.7;
    // else if (Number(qty) > 10) total *= 0.85;
    if (userType !== "vip" && Number(qty) > 10) {
      total *= 0.85;
    }

    return total;
  }
}
