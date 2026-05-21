// services/reportService.js

export function exportOrdersReport(orders) {
  let revenue = 0;

  const lines = [
    "id,user,item,qty,total,status"
  ];

  orders.forEach((order) => {
    if (order.status !== "REFUNDED") {
      revenue += order.total;
    }

    lines.push(
      `${order.id},${order.user},${order.item},${order.qty},${order.total},${order.status}`
    );
  });

  // Create CSV
  const blob = new Blob(
    [lines.join("\n")],
    { type: "text/csv" }
  );

  // Download file
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "orders_export.csv";

  a.click();

  return revenue;
}