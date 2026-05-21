export const paymentProcessors = {
  card: async (amount) => ({ ok: true, provider: 'card', amount }),
  paypal: async (amount) => ({ ok: true, provider: 'paypal', amount }),
  cod: async (amount) => ({ ok: true, provider: 'cod', amount })
};

export async function processPayment(type, amount) {
  const processor = paymentProcessors[type];
  if (!processor) return { ok: false, error: 'unsupported_payment' };
  try {
    return await processor(amount);
  } catch (err) {
    return { ok: false, error: err?.message || 'processor_error' };
  }
}
