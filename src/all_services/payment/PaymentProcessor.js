import { CardPayment } from "./CardPayment";
import { PaypalPayment } from "./PaypalPayment";
import { CODPayment } from "./CODPayment";

export function getPaymentProcessor(type) {
  switch (type) {
    case "card":
      return new CardPayment();

    case "paypal":
      return new PaypalPayment();

    case "cod":
      return new CODPayment();

    default:
      return null;
  }
}