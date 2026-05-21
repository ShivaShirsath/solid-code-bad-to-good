// Default payment strategies are kept separate from the payment service wrapper.
// SOLID: Open/Closed - new payment methods can be added by extending this map.
export const defaultPaymentStrategies = {
  card: ({ total }) => {
    console.log("Card gateway called for", total);
    return true;
  },
  paypal: ({ total }) => {
    console.log("PayPal gateway called for", total);
    return true;
  },
  cod: () => {
    console.log("Cash on delivery selected");
    return true;
  }
};