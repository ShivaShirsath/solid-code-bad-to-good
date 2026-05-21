/**
 * useOrders — custom hook.
 *
 * SRP: owns order state and its persistence side-effect.
 * Components get clean actions (placeOrder, refundOrder, exportReport)
 * without knowing about storage or services.
 */

import { useEffect, useState } from "react";
import { loadOrders, saveOrders } from "../adapters/storageAdapter.js";
import { placeOrder, refundOrder } from "../services/orderService.js";
import { exportOrdersCsv } from "../adapters/reportingAdapter.js";

export function useOrders() {
  const [orders, setOrders] = useState(() => loadOrders());
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  // Persist whenever orders change.
  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  async function handlePlaceOrder(formData) {
    setBusy(true);
    try {
      const result = await placeOrder(formData, orders);
      if (result.ok) setOrders(result.orders);
      setMessage(result.message);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setBusy(false);
    }
  }

  function handleRefund(orderId) {
    const result = refundOrder(orderId, orders);
    setOrders(result.orders);
    setMessage(result.message);
  }

  function handleExport() {
    const revenue = exportOrdersCsv(orders);
    setMessage(`CSV exported. Revenue: $${revenue.toFixed(2)}`);
  }

  return { orders, message, busy, handlePlaceOrder, handleRefund, handleExport };
}
