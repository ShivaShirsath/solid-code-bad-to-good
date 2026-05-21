import { CardPaymentProcessor } from "./card";
import { PayPalPaymentProcessor } from "./paypal";
import { CodPaymentProcessor } from "./cod";

const PROCESSORS = {
  card: new CardPaymentProcessor(),
  paypal: new PayPalPaymentProcessor(),
  cod: new CodPaymentProcessor()
};

/**
 * Resolves the appropriate payment processor strategy based on the selection.
 * 
 * @param {string} method - Payment method string ('card', 'paypal', 'cod')
 * @returns {import("./base").PaymentProcessor|null} Concrete processor instance or null
 */
export function getPaymentProcessor(method) {
  return PROCESSORS[method] || null;
}

export { PaymentProcessor } from "./base";
export { CardPaymentProcessor } from "./card";
export { PayPalPaymentProcessor } from "./paypal";
export { CodPaymentProcessor } from "./cod";
