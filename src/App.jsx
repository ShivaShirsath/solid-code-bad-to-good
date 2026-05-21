import React, { useEffect, useState } from "react";
import OrderForm from "./components/OrderForm";
import OrderTable from "./components/OrderTable";

import { calculateTotal } from "./services/pricingService";
import { getPaymentMethod } from "./services/paymentService";
import {sendEmailNotification,sendSMS} from "./services/notificationService";
import {loadOrders,saveOrders} from "./services/storageService";
import { exportCSV } from "./services/reportService";
import { createOrder } from "./utils/orderFactory";


export default function App() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  
 useEffect(() => {
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  async function handleBuy({ user, item, qty, payment }) {
    const total = calculateTotal(item, qty, user);

    const paymentMethod = getPaymentMethod(payment);

    if (!paymentMethod) {
      setMessage("Payment failed");
      return;
    }

    paymentMethod.pay();

    const newOrder = createOrder({
      user,
      item,
      qty,
      total
    });

    setOrders((prev) => [...prev, newOrder]);

    try {
      await sendEmailNotification(user, newOrder.id);
    } catch (err) {
      console.log("Email failed");
    }

    sendSMS(user, newOrder.id);

    setMessage(`Order ${newOrder.id} placed. Total: ${total}`);
  }

  function refund(orderId) {
    const updated = orders.map((o) => {
      if (o.id === orderId && o.status !== "REFUNDED") {
        return {
          ...o,
          status: "REFUNDED"
        };
      }

      return o;
    });

    setOrders(updated);
    setMessage(`Refund attempted for ${orderId}`);
  }

  function handleExport() {
    const revenue = exportCSV(orders);
    setMessage(`Revenue: ${revenue}`);
  }

  return (
    <div className="page">
      <h1>SOLID Commerce Admin</h1>

      <OrderForm
        onBuy={handleBuy}
        onExport={handleExport}
      />

      <OrderTable
        orders={orders}
        onRefund={refund}
      />

      <p>{message}</p>
    </div>
  );
}