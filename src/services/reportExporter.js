export function buildOrderCsv(orders) {
  const headers = ["id", "user", "item", "qty", "total", "status"];
  const lines = [headers.join(",")];

  orders.forEach((order) => {
    lines.push([
      order.id,
      order.user,
      order.item,
      order.qty,
      order.total,
      order.status
    ].join(","));
  });

  return lines.join("\n");
}

export function exportOrdersCsv(orders) {
  const csv = buildOrderCsv(orders);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "orders_export.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}
