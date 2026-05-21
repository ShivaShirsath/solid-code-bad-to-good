import { Order } from "../domain/Order";

const STORAGE_KEY = "orders";

export class LocalStorageOrderRepository {
  constructor(storageKey = STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  loadOrders() {
    const stored = localStorage.getItem(this.storageKey);
    const rawOrders = stored ? JSON.parse(stored) : [];
    return rawOrders.map((rawOrder) => new Order(rawOrder));
  }

  saveOrders(orders) {
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
  }

  addOrder(order) {
    const orders = this.loadOrders();
    const nextOrders = [...orders, order];
    this.saveOrders(nextOrders);
    return nextOrders;
  }

  refundOrder(orderId) {
    const orders = this.loadOrders();
    const nextOrders = orders.map((order) => {
      if (order.id === orderId) {
        return order.refund();
      }
      return order;
    });
    this.saveOrders(nextOrders);
    return nextOrders;
  }
}
