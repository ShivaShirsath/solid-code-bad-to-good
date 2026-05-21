const handlers = {
  card:   (order) => console.log("Card gateway →", order.id),
  paypal: (order) => console.log("PayPal API →",  order.id),
  cod:    (order) => console.log("Cash on delivery →", order.id),
};

export function processPayment(method, order) {
  const handle = handlers[method];
  if (!handle) throw new Error(`Unknown payment method: ${method}`);
  handle(order);
}