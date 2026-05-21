/**
 * useOrders.js
 *
 * I — Interface Segregation: exposes only the order-related operations
 *     that components actually need (placeOrder, refundOrder, exportReport).
 *     Components don't receive the raw setOrders setter or storage details.
 *
 * D — Dependency Inversion: this hook wires together the service layer;
 *     components depend on this hook's interface, not on concrete services.
 */

import { useEffect, useState } from "react";
import { loadOrders, saveOrders } from "../services/orderStorage";
import { calculateTotal } from "../services/pricingService";
import { processPayment } from "../services/paymentService";
import { sendConfirmationEmail, sendSmsNotification } from "../services/notificationService";
import { exportOrdersCsv } from "../services/reportService";

export function useOrders() {
  const [orders, setOrders] = useState(() => loadOrders());
  const [message, setMessage] = useState("");

  // Persist whenever orders change.
  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  /**
   * Creates and places a new order.
   * @param {{ user: string, item: string, qty: number, payment: string }} params
   */
  async function placeOrder({ user, item, qty, payment }) {
    const total = calculateTotal({ itemName: item, qty: Number(qty), userType: user });

    const newOrder = {
      id: Date.now(),
      user,
      item,
      qty: Number(qty),
      total,
      status: "PLACED",
    };

    const result = processPayment(payment, newOrder);
    if (!result.success) {
      setMessage(`Payment failed: ${result.message}`);
      return;
    }

    setOrders((prev) => [...prev, newOrder]);

    // Fire-and-forget notifications — failures don't block the order.
    sendSmsNotification(newOrder);
    await sendConfirmationEmail(newOrder);

    setMessage(`Order ${newOrder.id} placed. Total: $${total.toFixed(2)}`);
  }

  /**
   * Marks an order as REFUNDED.
   * @param {number} orderId
   */
  function refundOrder(orderId) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId && o.status !== "REFUNDED"
          ? { ...o, status: "REFUNDED" }
          : o
      )
    );
    setMessage(`Refund processed for order ${orderId}`);
  }

  /**
   * Exports orders as CSV and reports total revenue.
   */
  function exportReport() {
    const revenue = exportOrdersCsv(orders);
    setMessage(`CSV exported. Total revenue: $${revenue.toFixed(2)}`);
  }

  return { orders, message, placeOrder, refundOrder, exportReport };
}
