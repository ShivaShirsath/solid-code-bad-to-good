class CardPayment {
  pay() {
    console.log("Calling card gateway");
  }
}

class PaypalPayment {
  pay() {
    console.log("Calling paypal API");
  }
}

class CODPayment {
  pay() {
    console.log("Cash on delivery");
  }
}

export function getPaymentMethod(type) {
  const methods = {
    card: new CardPayment(),
    paypal: new PaypalPayment(),
    cod: new CODPayment()
  };

  return methods[type];
}