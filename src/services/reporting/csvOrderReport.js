import { calculateRevenue } from "../../domain/orders.js";

export function exportOrdersCsv(orders) {
  const lines = ["id,user,item,qty,total,status"];

  orders.forEach((order) => {
    lines.push(
      `${order.id},${order.user},${order.item},${order.qty},${order.total},${order.status}`
    );
  });

  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "orders_export.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function buildRevenueSummary(orders) {
  return calculateRevenue(orders);
}
