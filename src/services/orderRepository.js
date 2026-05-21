const KEY = "orders";

export const orderRepository = {
  load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {
      return [];
    }
  },

  save(orders) {
    localStorage.setItem(KEY, JSON.stringify(orders));
  },
};