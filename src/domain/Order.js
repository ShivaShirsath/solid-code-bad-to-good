export class Order {
  constructor({ id, user, item, qty, total, status = "PLACED" }) {
    this.id = id;
    this.user = user;
    this.item = item;
    this.qty = Number(qty);
    this.total = total;
    this.status = status;
  }

  static create({ user, item, qty, total }) {
    return new Order({
      id: Date.now(),
      user,
      item,
      qty,
      total,
      status: "PLACED",
    });
  }

  refund() {
    if (this.status === "REFUNDED") {
      return this;
    }
    return new Order({
      ...this,
      status: "REFUNDED",
    });
  }

  isRefunded() {
    return this.status === "REFUNDED";
  }

  toCsvLine() {
    return `${this.id},${this.user},${this.item},${this.qty},${this.total},${this.status}`;
  }
}
