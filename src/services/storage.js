export function loadOrders() {
  try {
    const s = localStorage.getItem("orders");
    return s ? JSON.parse(s) : [];
  } catch (e) {
    console.warn("loadOrders failed", e);
    return [];
  }
}

export function saveOrders(orders) {
  try {
    localStorage.setItem("orders", JSON.stringify(orders));
  } catch (e) {
    console.warn("saveOrders failed", e);
  }
}
