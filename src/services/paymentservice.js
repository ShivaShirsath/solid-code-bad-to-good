class CardPayment {

  pay() {
    console.log("Card payment");
  }
}

class PaypalPayment {

  pay() {
    console.log("Paypal payment");
  }
}

class CODPayment {

  pay() {
    console.log("Cash on delivery");
  }
}

export function getPaymentMethod(type) {

  switch(type) {

    case "card":
      return new CardPayment();

    case "paypal":
      return new PaypalPayment();

    case "cod":
      return new CODPayment();

    default:
      throw new Error(
        "Invalid payment method"
      );
  }
}