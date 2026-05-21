import React,{ useState } from "react";

import OrderForm from "./components/OrderForm";
import OrdersTable from "./components/OrdersTable";

import { useOrders } from "./hooks/useOrders";

import { calculateTotal } from "./services/pricingService";
import { exportOrdersCSV } from "./services/reportService";
import {
  sendEmail,
  sendSMS
} from "./services/notificationService";

import { PaymentFactory } from "./services/payment/PaymentFactory";

export default function App() {
  const { orders, addOrder, refundOrder } = useOrders();

  const [message, setMessage] = useState("");

  async function handleBuy(orderData) {
    try {
      const paymentProcessor =
        PaymentFactory.create(orderData.payment);

      const total = calculateTotal(
        orderData.item,
        orderData.qty,
        orderData.user
      );

      paymentProcessor.pay(total);

      const newOrder = {
        id: Date.now(),
        ...orderData,
        total,
        status: "PLACED"
      };

      addOrder(newOrder);

      await sendEmail(orderData.user, newOrder.id);

      sendSMS(orderData.user, newOrder.id);

      setMessage(
        `Order ${newOrder.id} placed. Total: ${total}`
      );
    } catch (err) {
      setMessage(err.message);
    }
  }

  function handleRefund(orderId) {
    refundOrder(orderId);

    setMessage(`Refund attempted for ${orderId}`);
  }

  function handleExport() {
    const revenue = exportOrdersCSV(orders);

    setMessage(`Revenue: ${revenue}`);
  }

  return (
    <div className="page">
      <h1>Commerce Admin</h1>

      <OrderForm
        onBuy={handleBuy}
        onExport={handleExport}
      />

      <OrdersTable
        orders={orders}
        onRefund={handleRefund}
      />

      <p>{message}</p>
    </div>
  );
}