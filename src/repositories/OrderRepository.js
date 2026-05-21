export class OrderRepository {

  static getOrders() {
    try {
      const data = localStorage.getItem("orders");
      const parsed = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  static saveOrders(orders) {
    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );
  }
}