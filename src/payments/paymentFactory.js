import { CardPayment } from "./CardPayment";
import { PaypalPayment } from "./PaypalPayment";
import { CODPayment } from "./CODPayment";

export function createPayment(method) {
  switch (method) {
    case "card":
      return new CardPayment();

    case "paypal":
      return new PaypalPayment();

    case "cod":
      return new CODPayment();

    default:
      throw new Error("Invalid payment method");
  }
}