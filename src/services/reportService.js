/**
 * reportService.js
 *
 * S — Single Responsibility: only handles report generation and export.
 *     Revenue calculation and CSV building live here, not in a component.
 */

/**
 * Calculates total revenue from non-refunded orders.
 * @param {Array} orders
 * @returns {number}
 */
export function calculateRevenue(orders) {
  return orders
    .filter((o) => o.status !== "REFUNDED")
    .reduce((sum, o) => sum + o.total, 0);
}

/**
 * Builds a CSV string from the orders array.
 * @param {Array} orders
 * @returns {string}
 */
export function buildCsv(orders) {
  const header = "id,user,item,qty,total,status";
  const rows = orders.map(
    (o) => `${o.id},${o.user},${o.item},${o.qty},${o.total},${o.status}`
  );
  return [header, ...rows].join("\n");
}

/**
 * Triggers a CSV file download in the browser.
 * @param {Array} orders
 * @returns {number} revenue total
 */
export function exportOrdersCsv(orders) {
  const csv = buildCsv(orders);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "orders_export.csv";
  anchor.click();
  URL.revokeObjectURL(url);

  return calculateRevenue(orders);
}
