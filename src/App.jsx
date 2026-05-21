import React, { useEffect, useState } from "react";

// Refactored to follow SOLID principles. See inline comments for rationale.
import StorageService from "./services/storageService";
import PaymentService from "./services/paymentService";
import NotificationService from "./services/notificationService";
import OrderService from "./services/orderService";
import ReportService from "./services/reportService";

// Create concrete implementations / strategies once.
// Placing these at module level avoids recreating them on each render.
const storage = new StorageService();

const payment = new PaymentService({
  card: ({ total }) => {
    // In a real app this would call a payment gateway SDK.
    console.log("Card gateway called for", total);
    return true;
  },
  paypal: ({ total }) => {
    console.log("PayPal gateway called for", total);
    return true;
  },
  cod: () => {
    console.log("Cash on delivery selected");
    return true;
  }
});

const notification = new NotificationService();
const orderService = new OrderService({ storage, payment, notification });
const reportService = new ReportService();

export default function App() {
  // UI state only: values and a local copy of orders for rendering.
  // Single Responsibility: this component now only handles rendering and user interactions.
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // load orders from storage via OrderService (Dependency Inversion)
    setOrders(orderService.getAll());
  }, []);

  function buyNow() {
    // Delegate business logic and side effects to OrderService.
    // This keeps the UI open for extension (Open/Closed) and smaller (Single Responsibility).
    const result = orderService.createOrder({ user, item, qty, paymentMethod });
    if (!result.success) {
      setMessage("Payment failed");
      return;
    }

    // refresh local orders from storage implementation
    setOrders(orderService.getAll());
    setMessage(`Order ${result.order.id} placed. Total: ${result.order.total}`);
  }

  function refund(orderId) {
    // Refund is handled by OrderService; UI doesn't mutate order shape directly.
    orderService.refund(orderId);
    setOrders(orderService.getAll());
    setMessage(`Refund attempted for ${orderId}`);
  }

  function exportReport() {
    // Report generation delegated to ReportService (Single Responsibility)
    reportService.exportCSV(orders);
    const rev = reportService.revenue(orders);
    setMessage(`Revenue: ${rev}`);
  }

  return (
    <div className="page">
      <h1>Commerce Admin (Refactored for SOLID)</h1>
      <p>Component now focuses on UI; services handle business and infra.</p>

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
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
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
