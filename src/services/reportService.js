export function exportCSV(orders) {
  let revenue = 0;

  const lines = ["id,user,item,qty,total,status"];

  orders.forEach((o) => {
    if (o.status !== "REFUNDED") {
      revenue += o.total;
    }

    lines.push(
      `${o.id},${o.user},${o.item},${o.qty},${o.total},${o.status}`
    );
  });

  const blob = new Blob([lines.join("\n")], {
    type: "text/csv"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "orders_export.csv";
  a.click();

  return revenue;
}