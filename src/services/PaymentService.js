class CardPayment {
  pay() {
    console.log("Processing Card Payment");
  }
}

class PaypalPayment {
  pay() {
    console.log("Processing Paypal Payment");
  }
}

class CODPayment {
  pay() {
    console.log("Cash on Delivery");
  }
}

const paymentMethods = {
  card: new CardPayment(),
  paypal: new PaypalPayment(),
  cod: new CODPayment()
};

export function processPayment(method) {
  const processor = paymentMethods[method];

  if (!processor) {
    throw new Error("Invalid Payment");
  }

  processor.pay();
}