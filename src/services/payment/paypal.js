import { PaymentProcessor } from "./base";

export class PayPalPaymentProcessor extends PaymentProcessor {
  constructor() {
    super("paypal");
  }

  async process(order) {
    console.log("Calling paypal API directly for order total:", order.total);
    // Simulating PayPal API call
    return { success: true, message: "PayPal payment processed successfully" };
  }
}
