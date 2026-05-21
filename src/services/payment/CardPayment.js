
import { PaymentProcessor } from "./PaymentProcessor";

export class CardPayment extends PaymentProcessor {
  process() {
    console.log("Processing card payment");
    return true;
  }
}