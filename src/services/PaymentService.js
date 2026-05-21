class CardPayment {
  pay() {
    console.log("Card payment processed");
  }
}

class PaypalPayment {
  pay() {
    console.log("Paypal payment processed");
  }
}

class CODPayment {
  pay() {
    console.log("Cash on delivery");
  }
}

export class PaymentService {
  static processors = {
    card: new CardPayment(),
    paypal: new PaypalPayment(),
    cod: new CODPayment()
  };

  static process(method) {
    const processor = this.processors[method];

    if (!processor) {
      throw new Error("Invalid payment method");
    }

    processor.pay();
  }
}