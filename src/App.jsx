import React, { useEffect, useState } from "react";

import OrderForm from "./components/OrderForm";
import OrderTable from "./components/OrderTable";

import { calculatePrice } from "./utils/pricing";

import { getPaymentMethod } from "./services/paymentservice";
import { sendEmail, sendSMS } from "./services/notificationservice";
import { storageService } from "./services/storageservice";
import { exportCSV } from "./services/reportservice";
export default function App() {

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // Load orders from localStorage
  useEffect(() => {

    const storedOrders = storageService.getOrders();

    setOrders(storedOrders);

  }, []);

  // Save orders whenever orders change
  useEffect(() => {

    storageService.saveOrders(orders);

  }, [orders]);

  // Create Order
  function createOrder(orderData) {

    const { user, item, qty, payment } = orderData;

    // Pricing logic
    const total = calculatePrice(item, qty, user);

    try {

      // Payment logic
      const paymentMethod = getPaymentMethod(payment);

      paymentMethod.pay();

      const newOrder = {
        id: Date.now(),
        user,
        item,
        qty,
        total,
        status: "PLACED"
      };

      // Update orders
      setOrders((prev) => [...prev, newOrder]);

      // Notifications
      sendEmail(user, newOrder.id);

      sendSMS(user, newOrder.id);

      // Success message
      setMessage(
        `Order ${newOrder.id} placed. Total: ${total}`
      );

    } catch (error) {

      setMessage("Payment failed");

    }
  }

  // Refund Order
  function refund(orderId) {

    const updatedOrders = orders.map((o) => {

      if (
        o.id === orderId &&
        o.status !== "REFUNDED"
      ) {

        return {
          ...o,
          status: "REFUNDED"
        };
      }

      return o;
    });

    setOrders(updatedOrders);

    setMessage(
      `Refund attempted for ${orderId}`
    );
  }

  // Export CSV Report
  function exportReport() {

    const revenue = exportCSV(orders);

    setMessage(`Revenue: ${revenue}`);
  }

  return (

    <div className="page">

      <h1>SOLID Commerce Admin</h1>

      <OrderForm
        onBuy={createOrder}
        onExport={exportReport}
      />

      <OrderTable
        orders={orders}
        onRefund={refund}
      />

      <p>{message}</p>

    </div>
  );
}