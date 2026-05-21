const ORDERS_KEY = "orders";

/**
 * Interface/Adapter for order storage persistence.
 */
export const OrderStorageService = {
  /**
   * Loads orders from local storage.
   * @returns {Array} List of orders
   */
  loadOrders() {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load orders from storage:", error);
      return [];
    }
  },

  /**
   * Persists orders to local storage.
   * @param {Array} orders - List of orders
   */
  saveOrders(orders) {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Failed to save orders to storage:", error);
    }
  }
};
