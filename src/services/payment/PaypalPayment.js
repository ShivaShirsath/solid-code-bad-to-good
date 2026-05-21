
import { PaymentProcessor } from "./PaymentProcessor";

export class PaypalPayment extends PaymentProcessor {
  process() {
    console.log("Processing PayPal payment");
    return true;
  }
}