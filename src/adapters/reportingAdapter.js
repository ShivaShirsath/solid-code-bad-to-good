/**
 * Reporting adapter — SRP + DIP.
 *
 * All CSV / export concerns live here.  The component calls
 * `exportOrdersCsv(orders)` and knows nothing about Blob, URL, or <a>.
 */

/**
 * Builds a CSV string from the orders array.
 */
function buildCsv(orders) {
  const header = "id,user,item,qty,total,status";
  const rows = orders.map(
    (o) => `${o.id},${o.user},${o.item},${o.qty},${o.total},${o.status}`
  );
  return [header, ...rows].join("\n");
}

/**
 * Calculates total revenue from non-refunded orders.
 */
export function calculateRevenue(orders) {
  return orders
    .filter((o) => o.status !== "REFUNDED")
    .reduce((sum, o) => sum + o.total, 0);
}

/**
 * Triggers a CSV file download in the browser and returns the revenue figure.
 *
 * @param {Order[]} orders
 * @returns {number} revenue
 */
export function exportOrdersCsv(orders) {
  const csv = buildCsv(orders);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "orders_export.csv";
  anchor.click();

  URL.revokeObjectURL(url); // clean up the object URL immediately

  return calculateRevenue(orders);
}
