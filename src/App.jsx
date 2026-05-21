import React, { useEffect, useState } from "react";
import { OrderForm } from "./components/OrderForm";
import { OrdersList } from "./components/OrdersList";
import { OrderRepository } from "./services/orderRepository";
import { calculateOrderTotal } from "./services/priceCalculator";
import { getPaymentProcessor } from "./payments/paymentProcessorFactory";
import { notifyOrderCreated, sendSms } from "./services/notificationService";
import { exportOrderReport } from "./services/reportExporter";

export default function App() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOrders(OrderRepository.load());
  }, []);

  useEffect(() => {
    OrderRepository.save(orders);
  }, [orders]);

  async function buyNow() {
    const quantity = Number(qty);
    const total = calculateOrderTotal(item, quantity, user);

    const paymentProcessor = getPaymentProcessor(payment);
    if (!paymentProcessor) {
      setMessage("Payment method is not supported.");
      return;
    }

    const order = {
      id: Date.now(),
      user,
      item,
      qty: quantity,
      total,
      status: "PLACED"
    };

    const result = await paymentProcessor.process(order);
    if (!result.success) {
      setMessage(result.message || "Payment failed.");
      return;
    }

    setOrders((prevOrders) => [...prevOrders, order]);
    notifyOrderCreated(order);
    sendSms(user, `Order ${order.id} placed`);
    setMessage(`Order ${order.id} placed. Total: ${order.total}`);
  }

  function refund(orderId) {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId && order.status !== "REFUNDED") {
          return { ...order, status: "REFUNDED" };
        }
        return order;
      })
    );
    setMessage(`Refund attempted for ${orderId}`);
  }

  function exportReport() {
    const revenue = exportOrderReport(orders);
    setMessage(`Revenue: ${revenue}`);
  }

  return (
    <div className="page">
      <h1>Commerce Admin (SOLID)</h1>
      <p>Refactored into separate services, adapters, and UI components.</p>

      <OrderForm
        user={user}
        item={item}
        qty={qty}
        payment={payment}
        onUserChange={setUser}
        onItemChange={setItem}
        onQtyChange={setQty}
        onPaymentChange={setPayment}
        onBuy={buyNow}
        onExport={exportReport}
      />

      <OrdersList orders={orders} onRefund={refund} />

      <p className="message">{message}</p>
    </div>
  );
}
