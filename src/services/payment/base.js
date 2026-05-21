/**
 * Abstract Payment Processor interface.
 * All concrete payment methods must extend this class and implement `process`.
 */
export class PaymentProcessor {
  constructor(methodName) {
    this.methodName = methodName;
  }

  /**
   * Processes the payment for an order.
   * @param {Object} order - The order details
   * @returns {Promise<{success: boolean, message: string}>} Result of the payment
   */
  async process(order) {
    throw new Error("process() must be implemented in subclass");
  }
}
