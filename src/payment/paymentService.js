// SRP: Only responsible for processing payments.
// OCP: Add a new payment method by adding an entry to PAYMENT_HANDLERS —
//      no existing code needs to change.
// DIP: The component depends on this abstraction, not on raw fetch/console calls.

const PAYMENT_HANDLERS = {
  card: (order) => {
    console.log("Calling card gateway for order", order.id);
    return true;
  },
  paypal: (order) => {
    console.log("Calling PayPal API for order", order.id);
    return true;
  },
  cod: (order) => {
    console.log("Cash on delivery for order", order.id);
    return true;
  },
};

/**
 * Returns true if payment succeeded, false otherwise.
 */
export function processPayment(paymentMethod, order) {
  const handler = PAYMENT_HANDLERS[paymentMethod];
  if (!handler) return false;
  return handler(order);
}
