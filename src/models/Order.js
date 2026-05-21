export class Order {
  constructor({ user, item, qty, total }) {
    this.id = Date.now();
    this.user = user;
    this.item = item;
    this.qty = qty;
    this.total = total;
    this.status = "PLACED";
  }
}