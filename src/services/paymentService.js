/**
 * paymentService.js
 *
 * O — Open/Closed: add a new payment method by adding an entry to
 *     PAYMENT_PROCESSORS — the processPayment() function never changes.
 * L — Liskov Substitution: every processor has the same shape
 *     { process(order): { success: boolean, message: string } }
 *     so they are fully interchangeable.
 */

const PAYMENT_PROCESSORS = {
  card: {
    process(order) {
      // In production: call your card gateway SDK here.
      console.log(`[Card] Charging ${order.total} for order ${order.id}`);
      return { success: true, message: "Card payment authorised" };
    },
  },

  paypal: {
    process(order) {
      // In production: call the PayPal REST API here.
      console.log(`[PayPal] Charging ${order.total} for order ${order.id}`);
      return { success: true, message: "PayPal payment authorised" };
    },
  },

  cod: {
    process(order) {
      console.log(`[COD] Cash on delivery scheduled for order ${order.id}`);
      return { success: true, message: "Cash on delivery confirmed" };
    },
  },
};

/**
 * Processes payment for an order using the registered processor.
 * Returns { success, message }.
 *
 * D — Dependency Inversion: callers depend on this abstraction, not on
 *     any specific gateway implementation.
 *
 * @param {string} method  - payment method key (e.g. "card")
 * @param {object} order   - the order object
 * @returns {{ success: boolean, message: string }}
 */
export function processPayment(method, order) {
  const processor = PAYMENT_PROCESSORS[method];
  if (!processor) {
    return { success: false, message: `Unknown payment method: ${method}` };
  }
  return processor.process(order);
}
