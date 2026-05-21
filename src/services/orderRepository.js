export const ORDER_STORAGE_KEY = "orders";

export class OrderRepository {
  constructor(storage) {
    this.storage = storage;
  }

  loadOrders() {
    const stored = this.storage.getItem(ORDER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  saveOrders(orders) {
    this.storage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  }
}

export const localOrderRepository = new OrderRepository(localStorage);
