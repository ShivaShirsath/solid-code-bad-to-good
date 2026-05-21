import { CardPayment } from "./CardPayment";
import { PaypalPayment } from "./PaypalPayment";
import { CodPayment } from "./CodPayment";

export class PaymentFactory {
  static create(method) {
    switch (method) {
      case "card":
        return new CardPayment();

      case "paypal":
        return new PaypalPayment();

      case "cod":
        return new CodPayment();

      default:
        throw new Error("Unsupported payment method");
    }
  }
}