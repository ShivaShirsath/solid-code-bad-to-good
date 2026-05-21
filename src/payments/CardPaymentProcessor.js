import { PaymentProcessor } from "./PaymentProcessor";

export class CardPaymentProcessor extends PaymentProcessor {
  async process(order) {
    console.log("Calling card gateway for order", order.id);
    return { success: true, message: "Card payment completed" };
  }
}
