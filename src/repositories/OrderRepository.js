export class OrderRepository {

  static getOrders() {
    const data = localStorage.getItem("orders");

    return data ? JSON.parse(data) : [];
  }

  static saveOrders(orders) {
    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );
  }
}