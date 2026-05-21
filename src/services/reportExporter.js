export function buildOrderCsv(orders) {
  const lines = ["id,user,item,qty,total,status"];
  orders.forEach((order) => {
    lines.push(`${order.id},${order.user},${order.item},${order.qty},${order.total},${order.status}`);
  });
  return lines.join("\n");
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportOrderReport(orders) {
  const revenue = orders.reduce((sum, order) => {
    return order.status !== "REFUNDED" ? sum + order.total : sum;
  }, 0);

  const csv = buildOrderCsv(orders);
  downloadCsv("orders_export.csv", csv);
  return revenue;
}
