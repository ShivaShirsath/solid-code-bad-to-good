/**
 * Storage adapter — DIP.
 *
 * Wraps localStorage behind a named interface so the rest of the app
 * never imports localStorage directly.  Swap this file for an
 * IndexedDB or remote-API adapter without touching any other module.
 */

const ORDERS_KEY = "orders";

export function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    console.warn("[StorageAdapter] Failed to load orders");
    return [];
  }
}

export function saveOrders(orders) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    console.warn("[StorageAdapter] Failed to save orders");
  }
}
