export class CardPaymentProcessor {
  async pay() {
    console.log("Card gateway processed payment");
    return true;
  }
}

export class PaypalPaymentProcessor {
  async pay() {
    console.log("Paypal gateway processed payment");
    return true;
  }
}

export class CodPaymentProcessor {
  async pay() {
    console.log("COD selected");
    return true;
  }
}
