/**
 * orderStorage.js
 *
 * S — Single Responsibility: only handles order persistence.
 * D — Dependency Inversion: the rest of the app calls load/save and
 *     never references localStorage directly, making it easy to swap
 *     to IndexedDB, a REST API, or a mock in tests.
 */

const STORAGE_KEY = "orders";

/**
 * Loads persisted orders from localStorage.
 * @returns {Array} orders array (empty array if nothing stored)
 */
export function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    console.warn("[Storage] Failed to load orders");
    return [];
  }
}

/**
 * Persists the orders array to localStorage.
 * @param {Array} orders
 */
export function saveOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    console.warn("[Storage] Failed to save orders");
  }
}
