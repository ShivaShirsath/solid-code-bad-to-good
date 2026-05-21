export const adapters = {
  card: async (order) => {
    console.log("[payment] card adapter", order.id);
    return { ok: true };
  },
  paypal: async (order) => {
    console.log("[payment] paypal adapter", order.id);
    return { ok: true };
  },
  cod: async (order) => {
    console.log("[payment] cod adapter", order.id);
    return { ok: true };
  },
};

export async function processPayment(method, order) {
  const adapter = adapters[method];
  if (!adapter) throw new Error("Unsupported payment method: " + method);
  return adapter(order);
}
