/**
 * Payment service — strategy pattern per payment method.
 *
 * OCP + DIP: the orchestrator depends on `processPayment(method, order)`,
 * not on concrete gateway implementations.  Adding a new method means
 * adding one entry to PAYMENT_STRATEGIES — nothing else changes.
 */

/**
 * Each strategy receives the order and returns a Promise<{ success, message }>.
 * Real implementations would call actual gateway SDKs here.
 */
const PAYMENT_STRATEGIES = {
  card: async (order) => {
    console.log(`[PaymentService] Card gateway called for order ${order.id}`);
    // await cardGateway.charge(order.total);
    return { success: true, message: "Card payment authorised" };
  },

  paypal: async (order) => {
    console.log(`[PaymentService] PayPal API called for order ${order.id}`);
    // await paypalClient.createPayment(order.total);
    return { success: true, message: "PayPal payment authorised" };
  },

  cod: async (order) => {
    console.log(`[PaymentService] Cash on delivery registered for order ${order.id}`);
    return { success: true, message: "Cash on delivery confirmed" };
  },
};

/**
 * Processes payment for the given method.
 *
 * @param {string} method  - payment method key
 * @param {object} order   - the order being paid for
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function processPayment(method, order) {
  const strategy = PAYMENT_STRATEGIES[method];
  if (!strategy) {
    return { success: false, message: `Unsupported payment method: ${method}` };
  }
  return strategy(order);
}

/**
 * Returns the list of supported payment method keys.
 * Keeps the form select in sync with the strategies map automatically.
 */
export function getSupportedPaymentMethods() {
  return Object.keys(PAYMENT_STRATEGIES);
}
