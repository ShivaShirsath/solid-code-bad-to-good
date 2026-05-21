import { PaymentProcessor } from "./PaymentProcessor";

export class CodPaymentProcessor extends PaymentProcessor {
  async process(order) {
    console.log("Processing cash on delivery for order", order.id);
    return { success: true, message: "Cash on delivery selected" };
  }
}
