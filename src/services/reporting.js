export function exportCSV(orders) {
  const lines = ["id,user,item,qty,total,status", ...orders.map((o) => `${o.id},${o.user},${o.item},${o.qty},${o.total},${o.status}`)];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "orders_export.csv";
  a.click();
}

export function calculateRevenue(orders) {
  return orders.reduce((sum, o) => (o.status !== "REFUNDED" ? sum + o.total : sum), 0);
}
