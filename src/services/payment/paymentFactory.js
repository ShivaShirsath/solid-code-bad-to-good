
import { CardPayment } from "./CardPayment";
import { PaypalPayment } from "./PaypalPayment";
import { CodPayment } from "./CodPayment";

export function getPaymentProcessor(type) {
  switch (type) {
    case "card":
      return new CardPayment();

    case "paypal":
      return new PaypalPayment();

    case "cod":
      return new CodPayment();

    default:
      throw new Error("Invalid payment method");
  }
}