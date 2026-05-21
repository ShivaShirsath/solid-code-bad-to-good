import { PaymentProcessor } from "./base";

export class CodPaymentProcessor extends PaymentProcessor {
  constructor() {
    super("cod");
  }

  async process(order) {
    console.log("Cash on delivery setup for order:", order.id);
    return { success: true, message: "Cash on delivery registered" };
  }
}
