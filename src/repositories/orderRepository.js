export class OrderRepository {
  constructor(storageKey = "orders") {
    this.storageKey = storageKey;
  }

  getAll() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveAll(orders) {
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
  }
}
