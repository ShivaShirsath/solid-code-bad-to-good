import { useCallback } from "react";
import { getPriceForItem, calculateTotal } from "../services/pricing";
import { applyDiscount } from "../services/discounts";
import { processPayment } from "../services/payment";
import { sendOrderConfirmation } from "../services/notifications";
import { generateCSVReport, calculateRevenue, downloadCSV } from "../services/reporting";

export function useOrderOperations(formState, orders, setOrders, setMessage) {
  const { user, item, qty, payment } = formState;

  const buyNow = useCallback(() => {
    if (!item || !payment || !qty) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const price = getPriceForItem(item);
      let total = calculateTotal(price, Number(qty));
      total = applyDiscount(total, user, Number(qty));

      processPayment(payment);

      const newOrder = {
        id: Date.now(),
        user,
        item,
        qty: Number(qty),
        total,
        status: "PLACED"
      };

      setOrders(prev => [...prev, newOrder]);
      sendOrderConfirmation(user, newOrder.id);
      setMessage(`✓ Order ${newOrder.id} placed. Total: $${total.toFixed(2)}`);
    } catch (error) {
      setMessage(`✗ Order failed: ${error.message}`);
    }
  }, [item, qty, user, payment, setOrders, setMessage]);

  const refund = useCallback((orderId) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId && o.status !== "REFUNDED" 
          ? { ...o, status: "REFUNDED" } 
          : o
      )
    );
    setMessage(`✓ Refund processed for ${orderId}`);
  }, [setOrders, setMessage]);

  const exportReport = useCallback(() => {
    try {
      const csv = generateCSVReport(orders);
      const revenue = calculateRevenue(orders);
      downloadCSV(csv);
      setMessage(`✓ Report exported. Revenue: $${revenue.toFixed(2)}`);
    } catch (error) {
      setMessage(`✗ Export failed: ${error.message}`);
    }
  }, [orders, setMessage]);

  return {
    buyNow,
    refund,
    exportReport
  };
}
