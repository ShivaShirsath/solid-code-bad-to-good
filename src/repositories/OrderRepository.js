export class OrderRepository {

  static getOrders() {
    const data = localStorage.getItem("orders");
    try {
      return data ? JSON.parse(data) : [];
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