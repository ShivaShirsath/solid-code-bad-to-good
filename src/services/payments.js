const PAYMENT_HANDLERS = {
  card: () => console.log("Calling card gateway directly"),
  paypal: () => console.log("Calling paypal API directly"),
  cod: () => console.log("Cash on delivery"),
};

export function processPayment(payment) {
  const handler = PAYMENT_HANDLERS[payment];

  if (!handler) {
    return { ok: false, message: "Payment failed" };
  }

  handler();
  return { ok: true };
}
