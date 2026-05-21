export function getRevenue(orders) {
  return orders
    .filter(o => o.status !== "REFUNDED")
    .reduce((sum, o) => sum + o.total, 0);
}

export function exportOrdersCSV(orders) {
  const rows = [
    "id,user,item,qty,total,status",
    ...orders.map(o =>
      `${o.id},${o.user},${o.item},${o.qty},${o.total},${o.status}`
    ),
  ];

  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "orders_export.csv";
  a.click();
  URL.revokeObjectURL(url);
}