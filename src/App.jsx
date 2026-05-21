import React, { useEffect, useState } from "react";
import { calculateOrderTotal } from "./services/pricing";
import { processPayment } from "./services/payments";
import { loadOrders, saveOrders } from "./services/storage";
import { createOrder, refundOrder } from "./services/orders";
import {
  buildOrdersCsv,
  calculateRevenue,
  downloadTextFile,
} from "./services/reporting";
import { sendOrderNotifications } from "./services/notifications";

export default function App() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");
  const [orders, setOrders] = useState(() => loadOrders());
  const [message, setMessage] = useState("");

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  function buyNow() {
    const paymentResult = processPayment(payment);
    if (!paymentResult.ok) {
      setMessage("Payment failed");
      return;
    }

    const total = calculateOrderTotal(user, item, qty);
    const newOrder = createOrder({ user, item, qty, total });

    setOrders((currentOrders) => [...currentOrders, newOrder]);
    sendOrderNotifications(newOrder);

    setMessage(`Order ${newOrder.id} placed. Total: ${total}`);
  }

  function refund(orderId) {
    setOrders((currentOrders) => refundOrder(currentOrders, orderId));
    setMessage(`Refund attempted for ${orderId}`);
  }

  function exportReport() {
    const revenue = calculateRevenue(orders);
    const csv = buildOrdersCsv(orders);
    downloadTextFile("orders_export.csv", csv, "text/csv");
    setMessage(`Revenue: ${revenue}`);
  }

  return (
    <div className="page">
      <h1>Bad Commerce Admin</h1>
      <p>Intentionally bad architecture for SOLID refactoring exercise.</p>

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
