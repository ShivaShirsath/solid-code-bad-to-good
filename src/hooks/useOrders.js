import { useState, useEffect } from "react";
import { orderRepository }     from "../services/orderRepository";
import { calculateTotal }       from "../services/pricingService";
import { processPayment }       from "../services/paymentService";
import { sendEmailConfirmation, sendSMSAlert } from "../services/notificationService";
import { exportOrdersCSV, getRevenue }         from "../services/reportService";

export function useOrders() {
  const [orders,  setOrders]  = useState(() => orderRepository.load());
  const [message, setMessage] = useState("");

  useEffect(() => {
    orderRepository.save(orders);
  }, [orders]);

  function placeOrder({ user, item, qty, payment }) {
    const total = calculateTotal(item, qty, user);
    const order = {
      id:     Date.now(),
      user,
      item,
      qty:    Number(qty),
      total,
      status: "PLACED",
    };

    try {
      processPayment(payment, order);
    } catch (e) {
      setMessage(e.message);
      return;
    }

    setOrders(prev => [...prev, order]);
    sendEmailConfirmation(user, order.id);
    sendSMSAlert(user, order.id);
    setMessage(`Order ${order.id} placed. Total: ${total}`);
  }

  function refundOrder(orderId) {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId && o.status !== "REFUNDED"
          ? { ...o, status: "REFUNDED" }
          : o
      )
    );
    setMessage(`Refund attempted for ${orderId}`);
  }

  function exportReport() {
    exportOrdersCSV(orders);
    setMessage(`Revenue: ${getRevenue(orders)}`);
  }

  return { orders, message, placeOrder, refundOrder, exportReport };
}