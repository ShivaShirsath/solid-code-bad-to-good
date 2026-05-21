
import { PaymentProcessor } from "./PaymentProcessor";

export class CodPayment extends PaymentProcessor {
  process() {
    console.log("Cash on delivery selected");
    return true;
  }
}