const STORAGE_KEY = "orders";

export function createOrderStorage(storage = localStorage) {
  return {
    load() {
      const stored = storage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    },
    save(orders) {
      storage.setItem(STORAGE_KEY, JSON.stringify(orders));
    },
  };
}
