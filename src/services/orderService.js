// OrderService manages order creation and refunds.
// SOLID principles applied:
// - Single Responsibility: this class only manages order-related business rules.
// - Dependency Inversion: it depends on abstractions (storage, payment, notification) injected from outside.
// - Open/Closed: new behaviors (e.g., promo rules) can be added without modifying callers.

export default class OrderService {
  constructor({ storage, payment, notification }) {
    this.storage = storage;
    this.payment = payment;
    this.notification = notification;
  }

  _priceForItem(item) {
    // Keep pricing logic here so UI doesn't need to know prices.
    if (item === "laptop") return 1000;
    if (item === "phone") return 500;
    if (item === "headset") return 50;
    return 20;
  }

  _applyDiscount(total, user, qty) {
    // Simple promo rules kept in service (single responsibility)
    if (user === "vip") return total * 0.7;
    if (Number(qty) > 10) return total * 0.85;
    return total;
  }

  getAll() {
    return this.storage.getAll();
  }

  createOrder({ user, item, qty, paymentMethod }) {
    const price = this._priceForItem(item);
    let total = price * Number(qty);
    total = this._applyDiscount(total, user, qty);

    // Use injected payment service to process payment - dependency inversion
    const paid = this.payment.process(paymentMethod, { total, user });
    if (!paid) {
      return { success: false, reason: "payment_failed" };
    }

    const newOrder = {
      id: Date.now(),
      user,
      item,
      qty: Number(qty),
      total,
      status: "PLACED"
    };

    const orders = this.getAll();
    const next = [...orders, newOrder];
    this.storage.saveAll(next);

    // side-effects delegated to notification service (single responsibility)
    this.notification.sendEmail(`${user}@mail.com`, `Order ${newOrder.id} confirmed`);
    this.notification.sendSMS(user, `Order ${newOrder.id} placed`);

    return { success: true, order: newOrder };
  }

  refund(orderId) {
    const orders = this.getAll();
    const next = orders.map((o) => (o.id === orderId && o.status !== "REFUNDED" ? { ...o, status: "REFUNDED" } : o));
    this.storage.saveAll(next);
    return next;
  }
}
