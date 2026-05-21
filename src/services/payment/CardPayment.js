export class CardPayment {
  pay(amount) {
    console.log(`Processing card payment: ${amount}`);
    return true;
  }
}