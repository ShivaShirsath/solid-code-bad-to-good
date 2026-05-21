/**
 * Exporter service handles writing orders to files and managing browser triggers.
 */
export const CSVExporter = {
  /**
   * Formats order logs and triggers a CSV file download in the browser.
   * 
   * @param {Array} orders - List of orders to export
   * @param {string} [filename='orders_export.csv'] - File name for the download
   */
  exportOrders(orders, filename = "orders_export.csv") {
    if (!orders || orders.length === 0) {
      console.warn("No orders available to export.");
      return;
    }

    const headers = ["id", "user", "item", "qty", "total", "status"];
    const rows = [headers.join(",")];

    orders.forEach(order => {
      rows.push(`${order.id},${order.user},${order.item},${order.qty},${order.total},${order.status}`);
    });

    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke URL to prevent memory leak
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
};
