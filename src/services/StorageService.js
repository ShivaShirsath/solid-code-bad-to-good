/*
========================================================
STORAGE SERVICE
========================================================

SOLID:
SRP

WHY?
----
Handles only localStorage operations.
========================================================
*/

class StorageService {

  static loadOrders() {

    const stored =
      localStorage.getItem("orders");

    return stored
      ? JSON.parse(stored)
      : [];
  }


  static saveOrders(orders) {

    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );
  }
}

export default StorageService;