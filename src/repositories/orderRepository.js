const STORAGE_KEY = "orders";

export const orderRepository = {
  getAll() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAll(orders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
};