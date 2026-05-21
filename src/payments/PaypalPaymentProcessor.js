import { PaymentProcessor } from "./PaymentProcessor";

export class PaypalPaymentProcessor extends PaymentProcessor {
  async process(order) {
    console.log("Calling PayPal API for order", order.id);
    return { success: true, message: "PayPal payment completed" };
  }
}
