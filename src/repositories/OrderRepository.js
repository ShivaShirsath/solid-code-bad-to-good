/**
 * OrderRepository abstracts the storage logic (Dependency Inversion Principle).
 * The app depends on this abstraction rather than knowing about localStorage directly.
 */

const STORAGE_KEY = "orders";

export class OrderRepository {
  static getOrders() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to parse orders from storage", error);
    }
    return [];
  }

  static saveOrders(orders) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Failed to save orders to storage", error);
    }
  }
}
