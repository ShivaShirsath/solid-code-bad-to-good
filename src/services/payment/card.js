import { PaymentProcessor } from "./base";

export class CardPaymentProcessor extends PaymentProcessor {
  constructor() {
    super("card");
  }

  async process(order) {
    console.log("Calling card gateway directly for order total:", order.total);
    // Simulating card payment integration logic
    return { success: true, message: "Card payment processed successfully" };
  }
}
