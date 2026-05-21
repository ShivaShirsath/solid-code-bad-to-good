/*
========================================================
PAYMENT SERVICES
========================================================

SOLID PRINCIPLES:
-----------------
1. OCP (Open Closed Principle)
2. LSP (Liskov Substitution Principle)
3. DIP (Dependency Inversion Principle)

========================================================
*/


/*
========================================================
CARD PAYMENT
========================================================

LSP:
Can replace any payment service safely.
========================================================
*/

class CardPayment {

  pay(amount) {
    console.log(
      `Card payment successful: ${amount}`
    );

    return true;
  }
}


/*
========================================================
PAYPAL PAYMENT
========================================================
*/

class PaypalPayment {

  pay(amount) {

    console.log(
      `Paypal payment successful: ${amount}`
    );

    return true;
  }
}


/*
========================================================
COD PAYMENT
========================================================
*/

class CodPayment {

  pay(amount) {

    console.log(
      `Cash on Delivery selected`
    );

    return true;
  }
}


/*
========================================================
PAYMENT FACTORY
========================================================

OCP:
New payment methods can be ADDED
without modifying App component.

Example:
--------
Add:
class UpiPayment {}

Then update factory only.

WHY?
----
Scalable architecture.
========================================================
*/

class PaymentFactory {

  static create(type) {

    switch (type) {

      case "card":
        return new CardPayment();

      case "paypal":
        return new PaypalPayment();

      case "cod":
        return new CodPayment();

      default:
        return null;
    }
  }
}

export default PaymentFactory;