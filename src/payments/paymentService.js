// PaymentService stays tiny: it only dispatches to a strategy.
// SOLID: Single Responsibility - choose and invoke the right payment strategy.
export default class PaymentService {
  constructor(strategies = {}) {
    this.strategies = strategies;
  }

  process(method, payload) {
    const fn = this.strategies[method];
    if (!fn) {
      return false;
    }

    return fn(payload);
  }
}