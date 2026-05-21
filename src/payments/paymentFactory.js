import { processCardPayment } from "./cardPayment";
import { processPaypalPayment } from "./paypalPayment";
import { processCODPayment } from "./codPayment";

export function processPayment(paymentType) {
  const methods = {
    card: processCardPayment,
    paypal: processPaypalPayment,
    cod: processCODPayment
  };

  const paymentMethod = methods[paymentType];

  if (!paymentMethod) {
    throw new Error("Invalid payment");
  }

  paymentMethod();
}