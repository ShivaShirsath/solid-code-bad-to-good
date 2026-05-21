import React, { useEffect, useState } from "react";
import { calculateTotal } from "./services/pricing";
import { processPayment } from "./services/paymentAdapters";
import { notifyOrderPlaced } from "./services/notification";
import { loadOrders, saveOrders } from "./services/storage";
import { exportCSV, calculateRevenue } from "./services/reporting";

export default function App() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  async function buyNow() {
    const { total } = calculateTotal({ item, qty, user });

    try {
      await processPayment(payment, { item, qty, user, total });
    } catch (e) {
      setMessage("Payment failed: " + e.message);
      return;
    }

    const newOrder = {
      id: Date.now(),
      user,
      item,
      qty: Number(qty),
      total,
      status: "PLACED",
    };

    setOrders((prev) => [...prev, newOrder]);

    notifyOrderPlaced(newOrder).catch(() => {});

    setMessage(`Order ${newOrder.id} placed. Total: ${total}`);
  }

  function refund(orderId) {
    setOrders((prev) => prev.map((o) => (o.id === orderId && o.status !== "REFUNDED" ? { ...o, status: "REFUNDED" } : o)));
    setMessage(`Refund attempted for ${orderId}`);
  }

  function exportReport() {
    exportCSV(orders);
    const revenue = calculateRevenue(orders);
    setMessage(`Revenue: ${revenue}`);
  }

  return (
    <div className="page">
      <h1>Refactored Commerce Admin</h1>
      <p>Small UI that delegates pricing, payments, notifications, storage and reporting.</p>

      <div className="card">
        <h2>Create Order</h2>
        <label>User</label>
        <input value={user} onChange={(e) => setUser(e.target.value)} />

        <label>Item</label>
        <select value={item} onChange={(e) => setItem(e.target.value)}>
          <option value="laptop">laptop</option>
          <option value="phone">phone</option>
          <option value="headset">headset</option>
          <option value="misc">misc</option>
        </select>

        <label>Qty</label>
        <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />

        <label>Payment</label>
        <select value={payment} onChange={(e) => setPayment(e.target.value)}>
          <option value="card">card</option>
          <option value="paypal">paypal</option>
          <option value="cod">cod</option>
        </select>

        <button onClick={buyNow}>Buy</button>
        <button onClick={exportReport}>Export CSV + Revenue</button>
      </div>

      <div className="card">
        <h2>Orders</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.user}</td>
                <td>{o.item}</td>
                <td>{o.qty}</td>
                <td>{o.total}</td>
                <td>{o.status}</td>
                <td>
                  <button onClick={() => refund(o.id)}>Refund</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="message">{message}</p>
    </div>
  );
}
