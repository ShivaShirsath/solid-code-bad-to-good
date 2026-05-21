import { useState, useEffect, useCallback } from "react";
import { calculateOrderPrice } from "../domain";
import {
  OrderStorageService,
  getPaymentProcessor,
  notificationDispatcher,
  CSVExporter
} from "../services";

/**
 * Hook for coordinating all order transactions and persistence.
 */
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize orders on mount using storage service
  useEffect(() => {
    const storedOrders = OrderStorageService.loadOrders();
    setOrders(storedOrders);
  }, []);

  // Persist orders automatically on state change
  useEffect(() => {
    if (orders.length > 0) {
      OrderStorageService.saveOrders(orders);
    }
  }, [orders]);

  /**
   * Helper to trigger stateful toast alerts.
   */
  const triggerToast = useCallback((type, message) => {
    setToast({ type, message });
    
    // Clear toast automatically after 4 seconds
    const timer = setTimeout(() => {
      setToast(current => (current && current.message === message ? null : current));
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Orchestrates the order placement flow:
   * 1. Calculate price (Domain)
   * 2. Run pluggable payment process (Service Strategy)
   * 3. Persist order (Service Storage)
   * 4. Dispatch multi-channel notifications (Service Observer)
   */
  const placeOrder = useCallback(async ({ user, item, qty, paymentMethod }) => {
    if (!user.trim()) {
      triggerToast("error", "Username cannot be empty");
      return false;
    }
    if (Number(qty) <= 0) {
      triggerToast("error", "Quantity must be greater than zero");
      return false;
    }

    setIsProcessing(true);
    triggerToast("info", "Initiating checkout...");

    try {
      const calculatedTotal = calculateOrderPrice(item, qty, user);
      
      const newOrder = {
        id: Date.now(),
        user: user.trim(),
        item,
        qty: Number(qty),
        total: calculatedTotal,
        status: "PLACED"
      };

      // Retrieve payment processor strategy
      const processor = getPaymentProcessor(paymentMethod);
      if (!processor) {
        triggerToast("error", `Unsupported payment method: "${paymentMethod}"`);
        setIsProcessing(false);
        return false;
      }

      // Execute transaction
      const paymentResult = await processor.process(newOrder);
      if (!paymentResult.success) {
        triggerToast("error", `Transaction failed: ${paymentResult.message}`);
        setIsProcessing(false);
        return false;
      }

      // Append state & persist
      setOrders(currentOrders => {
        const nextOrders = [...currentOrders, newOrder];
        OrderStorageService.saveOrders(nextOrders);
        return nextOrders;
      });

      triggerToast("success", `Success! Order #${newOrder.id} placed. Total: $${calculatedTotal.toFixed(2)}`);

      // Fire notifications in the background
      notificationDispatcher.dispatch(newOrder);

      setIsProcessing(false);
      return true;
    } catch (error) {
      console.error("Order processing encountered an error:", error);
      triggerToast("error", "System error while completing purchase.");
      setIsProcessing(false);
      return false;
    }
  }, [triggerToast]);

  /**
   * Refunding flow updates order status.
   */
  const refundOrder = useCallback((orderId) => {
    setOrders(currentOrders => {
      let isModified = false;
      const nextOrders = currentOrders.map(order => {
        if (order.id === orderId && order.status !== "REFUNDED") {
          isModified = true;
          return { ...order, status: "REFUNDED" };
        }
        return order;
      });

      if (isModified) {
        OrderStorageService.saveOrders(nextOrders);
        triggerToast("success", `Order #${orderId} was refunded.`);
      } else {
        triggerToast("info", `Order #${orderId} is already refunded.`);
      }

      return nextOrders;
    });
  }, [triggerToast]);

  /**
   * Exporter triggers clean CSV file generation.
   */
  const exportCSVReport = useCallback(() => {
    if (orders.length === 0) {
      triggerToast("error", "No orders exist to export.");
      return;
    }

    try {
      CSVExporter.exportOrders(orders);
      
      const totalRevenue = orders
        .filter(o => o.status !== "REFUNDED")
        .reduce((sum, o) => sum + o.total, 0);

      triggerToast("success", `CSV Exported! Total Revenue: $${totalRevenue.toFixed(2)}`);
    } catch (error) {
      console.error("CSV Export error:", error);
      triggerToast("error", "Failed to generate CSV export file.");
    }
  }, [orders, triggerToast]);

  return {
    orders,
    toast,
    isProcessing,
    placeOrder,
    refundOrder,
    exportCSVReport,
    triggerToast
  };
}
