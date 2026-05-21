export class PaypalPayment {
  pay(amount) {
    console.log(`Processing PayPal payment: ${amount}`);
    return true;
  }
}