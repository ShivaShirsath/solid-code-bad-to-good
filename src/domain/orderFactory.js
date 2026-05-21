export function createOrder({ user, item, qty, total }) {
  return {
    id: Date.now(),
    user,
    item,
    qty: Number(qty),
    total,
    status: 'PLACED'
  };
}
