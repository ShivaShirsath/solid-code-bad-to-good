/**
 * Payment Processor interface concept (Liskov Substitution Principle).
 * All strategies should expose a `process(amount)` method.
 */

export class CardPaymentProcessor {
  process(amount) {
    console.log(`Calling card gateway directly for amount: ${amount}`);
    return true; // Simulate success
  }
}

export class PaypalPaymentProcessor {
  process(amount) {
    console.log(`Calling paypal API directly for amount: ${amount}`);
    return true;
  }
}

export class CODPaymentProcessor {
  process(amount) {
    console.log(`Cash on delivery arranged for amount: ${amount}`);
    return true;
  }
}

// Registry for payment strategies (Open/Closed Principle)
const PaymentStrategies = {
  card: new CardPaymentProcessor(),
  paypal: new PaypalPaymentProcessor(),
  cod: new CODPaymentProcessor(),
};

export class PaymentProcessor {
  /**
   * Delegates the payment processing to the correct strategy.
   * @param {string} method - The payment method (e.g., 'card', 'paypal')
   * @param {number} amount - The amount to charge
   * @returns {boolean} - Success or failure
   */
  static executePayment(method, amount) {
    const strategy = PaymentStrategies[method];
    if (!strategy) {
      console.error(`Unknown payment method: ${method}`);
      return false;
    }
    return strategy.process(amount);
  }
}
