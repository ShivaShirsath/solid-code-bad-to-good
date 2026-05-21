// PaymentService implements a strategy pattern for different payment methods.
// SOLID: Open/Closed - new payment strategies can be added without modifying existing code.
export default class PaymentService {
  constructor(strategies = {}) {
    // strategies: { card: fn, paypal: fn, cod: fn }
    this.strategies = strategies;
  }

  process(method, payload) {
    const fn = this.strategies[method];
    if (!fn) {
      // unknown payment method -> fail gracefully
      return false;
    }
    return fn(payload);
  }
}
