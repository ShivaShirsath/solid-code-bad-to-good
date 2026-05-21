export class OrderFactory {
  create({ user, item, qty, total }) {
    return {
      id: Date.now(),
      user,
      item,
      qty,
      total,
      status: "PLACED"
    };
  }
}
