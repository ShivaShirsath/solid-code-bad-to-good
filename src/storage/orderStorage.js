// SRP: Only responsible for persisting and loading orders.
// DIP: The component calls these functions instead of touching localStorage directly.
//      Swap to IndexedDB or an API by changing only this file.

const STORAGE_KEY = "orders";

export function loadOrders() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}
