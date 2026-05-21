/**
 * Base Discount Strategy Interface
 */
export class DiscountStrategy {
  constructor(name, priority) {
    this.name = name;
    this.priority = priority; // Higher priority runs first
  }

  /**
   * Checks if this strategy is applicable.
   * @param {string} user 
   * @param {number} qty 
   * @param {number} baseTotal 
   * @returns {boolean}
   */
  shouldApply(user, qty, baseTotal) {
    return false;
  }

  /**
   * Applies the discount to the total.
   * @param {number} total 
   * @returns {number}
   */
  apply(total) {
    return total;
  }
}

/**
 * VIP Discount Strategy - 30% off (Priority: 2)
 */
export class VipDiscountStrategy extends DiscountStrategy {
  constructor() {
    super("VIP Discount", 2);
  }

  shouldApply(user, qty, baseTotal) {
    return user && user.toLowerCase() === "vip";
  }

  apply(total) {
    return total * 0.7;
  }
}

/**
 * Bulk Purchase Discount Strategy - 15% off for > 10 items (Priority: 1)
 */
export class BulkDiscountStrategy extends DiscountStrategy {
  constructor() {
    super("Bulk Discount", 1);
  }

  shouldApply(user, qty, baseTotal) {
    return qty > 10;
  }

  apply(total) {
    return total * 0.85;
  }
}

// Active strategies ordered by priority
export const ACTIVE_DISCOUNT_STRATEGIES = [
  new VipDiscountStrategy(),
  new BulkDiscountStrategy()
];
