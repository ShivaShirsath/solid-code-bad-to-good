const cardProcessor = {
  async process() {
    console.log("Calling card gateway directly");
    return { success: true };
  },
};

const paypalProcessor = {
  async process() {
    console.log("Calling paypal API directly");
    return { success: true };
  },
};

const codProcessor = {
  async process() {
    console.log("Cash on delivery");
    return { success: true };
  },
};

export const paymentProcessors = {
  card: cardProcessor,
  paypal: paypalProcessor,
  cod: codProcessor,
};

export async function processPayment(method) {
  const processor = paymentProcessors[method];
  if (!processor) {
    return { success: false, message: "Payment failed" };
  }
  return processor.process();
}
