export const OrderRepository = {
  load() {
    const stored = localStorage.getItem("orders");
    return stored ? JSON.parse(stored) : [];
  },

  save(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
  }
};
