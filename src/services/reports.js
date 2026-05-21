// SOLID: Single Responsibility - Report generation only
// Follows: SRP (reporting logic separated)

export function generateCSVReport(orders) {
  const lines = ["id,user,item,qty,total,status"];

  orders.forEach((o) => {
    lines.push(`${o.id},${o.user},${o.item},${o.qty},${o.total},${o.status}`);
  });

  return lines.join("\n");
}

export function calculateRevenue(orders) {
  return orders.reduce((total, order) => {
    if (order.status !== "REFUNDED") {
      return total + order.total;
    }
    return total;
  }, 0);
}

export function exportCSV(orders, filename = "orders_export.csv") {
  const csv = generateCSVReport(orders);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
