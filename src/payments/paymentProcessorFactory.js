import { CardPaymentProcessor } from "./CardPaymentProcessor";
import { PaypalPaymentProcessor } from "./PaypalPaymentProcessor";
import { CodPaymentProcessor } from "./CodPaymentProcessor";

const processors = {
  card: new CardPaymentProcessor(),
  paypal: new PaypalPaymentProcessor(),
  cod: new CodPaymentProcessor()
};

export function getPaymentProcessor(method) {
  return processors[method] ?? null;
}
