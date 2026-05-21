export const storageService = {

  saveOrders(orders) {
    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );
  },

  getOrders() {
    return JSON.parse(
      localStorage.getItem("orders")
    ) || [];
  }
};