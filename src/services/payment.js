const paymentProcessors = {
  card: () => {
    console.log("Calling card gateway directly");
    return true;
  },

  paypal: () => {
    console.log("Calling paypal API directly");
    return true;
  },

  cod: () => {
    console.log("Cash on delivery");
    return true;
  }
};

export function processPayment(payment) {
  const processor = paymentProcessors[payment];

  if (!processor) {
    console.log("Unsupported payment method");
    return false;
  }

  return processor();
}