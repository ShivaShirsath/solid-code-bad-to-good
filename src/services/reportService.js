import { calculateRevenue } from "../utils/orderMath";

// ReportService handles exports and revenue calculations.
// SOLID: Single Responsibility - report generation separated from UI and order logic.
export default class ReportService {
  exportCSV(orders, filename = "orders_export.csv") {
    const lines = ["id,user,item,qty,total,status"];
    orders.forEach((o) => {
      lines.push(`${o.id},${o.user},${o.item},${o.qty},${o.total},${o.status}`);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }

  revenue(orders) {
    return calculateRevenue(orders);
  }
}
