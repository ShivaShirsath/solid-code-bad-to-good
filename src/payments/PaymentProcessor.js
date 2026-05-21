export class PaymentProcessor {
  async process(order) {
    throw new Error("PaymentProcessor.process() must be implemented by a subclass");
  }
}
