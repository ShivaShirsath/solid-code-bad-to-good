/**
 * Order factory — single responsibility: construct a valid order object.
 *
 * Keeps the shape of an order in one place so every consumer
 * gets the same structure.
 */

/**
 * @param {{ user: string, item: string, qty: number, total: number }} params
 * @returns {Order}
 */
export function createOrder({ user, item, qty, total }) {
  return {
    id: Date.now(),
    user,
    item,
    qty,
    total,
    status: "PLACED",
  };
}
