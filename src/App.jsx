import React, { useEffect, useState } from "react";
import { createOrder } from "./orderService";
import { getItemPrice, applyDiscount, processPayment } from "./paymentService";
import { loadOrders, saveOrders } from "./storageService";
import { exportOrdersCsv, calculateRevenue } from "./reportService";
import { notifyCustomer } from "./notificationService";
import OrderForm from "./components/OrderForm";
import OrderTable from "./components/OrderTable";

export default function App() {
  const [form, setForm] = useState({ user: "vip", item: "laptop", qty: 1, payment: "card" });
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  function handleInput(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBuy() {
    const price = getItemPrice(form.item);
    const total = applyDiscount(price * Number(form.qty), form.user, form.qty);

    if (!processPayment(form.payment)) {
      setMessage("Payment failed");
      return;
    }

    const newOrder = createOrder({
      user: form.user,
      item: form.item,
      qty: form.qty,
      total,
    });

    setOrders((prev) => [...prev, newOrder]);
    notifyCustomer(form.user, newOrder.id);
    setMessage(`Order ${newOrder.id} placed. Total: ${total}`);
  }

  function handleRefund(orderId) {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId && order.status !== "REFUNDED") {
          return { ...order, status: "REFUNDED" };
        }
        return order;
      })
    );
    setMessage(`Refund attempted for ${orderId}`);
  }

  function handleExport() {
    exportOrdersCsv(orders);
    setMessage(`Revenue: ${calculateRevenue(orders)}`);
  }

  return (
    <div className="page">
      <h1>Commerce Admin</h1>
      <p>SOLID-aligned refactor: UI, business rules, and side effects are separated.</p>

      <OrderForm {...form} onInput={handleInput} />

      <div className="card">
        <button onClick={handleBuy}>Buy</button>
        <button onClick={handleExport}>Export CSV + Revenue</button>
      </div>

      <OrderTable orders={orders} onRefund={handleRefund} />
      <p className="message">{message}</p>
    </div>
  );
}
