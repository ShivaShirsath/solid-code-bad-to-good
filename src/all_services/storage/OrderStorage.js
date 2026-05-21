export function loadOrders() {
  const data = localStorage.getItem("orders");

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}