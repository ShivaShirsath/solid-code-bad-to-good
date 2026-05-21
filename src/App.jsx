// App.jsx — Orchestrator only.
// SRP: App's only job is to wire state, services, and UI components together.
//      All business logic lives in dedicated service modules.

import React, { useEffect, useState } from "react";

import { calculateTotal }          from "./pricing/pricingService";
import { processPayment }          from "./payment/paymentService";
import { sendEmailNotification,
         sendSmsNotification }     from "./notifications/notificationService";
import { loadOrders, saveOrders }  from "./storage/orderStorage";
import { exportOrdersCSV }         from "./reports/reportService";
import { createOrder, refundOrder } from "./orders/orderService";

import OrderForm  from "./components/OrderForm";
import OrderTable from "./components/OrderTable";

export default function App() {
  const [user,    setUser]    = useState("vip");
  const [item,    setItem]    = useState("laptop");
  const [qty,     setQty]     = useState(1);
  const [payment, setPayment] = useState("card");
  const [orders,  setOrders]  = useState([]);
  const [message, setMessage] = useState("");

  // Load persisted orders on mount
  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  // Persist whenever orders change
  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  function handleBuy() {
    const total    = calculateTotal(item, Number(qty), user);
    const newOrder = createOrder(user, item, qty, total);

    const success  = processPayment(payment, newOrder);
    if (!success) {
      setMessage("Payment failed");
      return;
    }
// k
    setOrders((prev) => [...prev, newOrder]);
    sendEmailNotification(user, newOrder);
    sendSmsNotification(user, newOrder);
    setMessage(`Order ${newOrder.id} placed. Total: ${total}`);
  }

  function handleRefund(orderId) {
    setOrders((prev) => refundOrder(prev, orderId));
    setMessage(`Refund attempted for ${orderId}`);
  }

  function handleExport() {
    const revenue = exportOrdersCSV(orders);
    setMessage(`Revenue: ${revenue}`);
  }

  return (
    <div className="page">
      <h1>Good Commerce Admin</h1>
      <p>Refactored to follow SOLID principles.</p>

      <OrderForm
        user={user}       setUser={setUser}
        item={item}       setItem={setItem}
        qty={qty}         setQty={setQty}
        payment={payment} setPayment={setPayment}
        onBuy={handleBuy}
        onExport={handleExport}
      />

      <OrderTable orders={orders} onRefund={handleRefund} />

      <p className="message">{message}</p>
    </div>
  );
}
