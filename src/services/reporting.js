export function calculateRevenue(orders) {
  return orders.reduce((total, order) => {
    return order.status === "REFUNDED" ? total : total + order.total;
  }, 0);
}

export function buildOrdersCsv(orders) {
  const lines = ["id,user,item,qty,total,status"];

  orders.forEach((order) => {
    lines.push(
      `${order.id},${order.user},${order.item},${order.qty},${order.total},${order.status}`
    );
  });

  return lines.join("\n");
}

export function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
