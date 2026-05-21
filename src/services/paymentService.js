export class PaymentGateway {
  constructor(gateways) {
    this.gateways = gateways;
  }

  pay(paymentMethod, amount) {
    const gateway = this.gateways[paymentMethod];
    if (!gateway) {
      throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
    return gateway(amount);
  }
}

export const paymentGateways = {
  card: (amount) => {
    console.log("Processing card payment", amount);
    return { success: true, provider: "card" };
  },
  paypal: (amount) => {
    console.log("Processing PayPal payment", amount);
    return { success: true, provider: "paypal" };
  },
  cod: (amount) => {
    console.log("Processing cash on delivery", amount);
    return { success: true, provider: "cod" };
  }
};

export const paymentGateway = new PaymentGateway(paymentGateways);
