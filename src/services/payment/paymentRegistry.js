import { CardGateway }   from "./CardGateway.js";
import { PayPalGateway } from "./PayPalGateway.js";
import { CodGateway }    from "./CodGateway.js";

const GATEWAY_MAP = {
  card:   new CardGateway(),
  paypal: new PayPalGateway(),
  cod:    new CodGateway(),
};

export function getPaymentGateway(method) {
  return GATEWAY_MAP[method] ?? null;
}
