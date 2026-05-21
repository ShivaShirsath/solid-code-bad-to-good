import { applyDiscount, getItemPrice } from "../utils/orderMath";

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
    // Pricing lives in a pure utility so it can be reused and tested separately.
    return getItemPrice(item);
  }

  _applyDiscount(total, user, qty) {
    // Discount rules are also kept in a pure utility for easy testing.
    return applyDiscount(total, user, qty);
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
