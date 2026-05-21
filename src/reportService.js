export function formatOrdersCsv(orders) {
  const header = ["id", "user", "item", "qty", "total", "status"];
  const rows = orders.map((order) => [
    order.id,
    order.user,
    order.item,
    order.qty,
    order.total,
    order.status,
  ]);
  return [header, ...rows].map((row) => row.join(",")).join("\n");
}

export function exportOrdersCsv(orders) {
  const csv = formatOrdersCsv(orders);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "orders_export.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function calculateRevenue(orders) {
  return orders.reduce((sum, order) => {
    return order.status !== "REFUNDED" ? sum + order.total : sum;
  }, 0);
}
