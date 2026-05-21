import React, { useEffect, useState } from "react";
import {
  getItemPrice,
  calculateTotal,
  processPayment,
  notifyCustomer,
  createOrder,
  refundOrder,
  StorageService,
  exportCSV,
  calculateRevenue,
  getAvailablePaymentMethods
} from "./services";

// SOLID: App is now UI-only, delegates all business logic to services
// Follows: SRP (UI concerns only), DIP (depends on service abstractions)
export default function App() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // Load orders from storage on mount
  useEffect(() => {
    const stored = StorageService.get("orders");
    if (stored) {
      setOrders(stored);
    }
  }, []);

  // Persist orders to storage when they change
  useEffect(() => {
    if (orders.length > 0) {
      StorageService.set("orders", orders);
    }
  }, [orders]);

  function handleBuyNow() {
    // Get item price from pricing service
    const price = getItemPrice(item);

    // Calculate total with discounts
    const total = calculateTotal(price, qty, user);

    // Process payment
    const paymentResult = processPayment(payment, total);
    if (!paymentResult.success) {
      setMessage("Payment failed");
      return;
    }

    // Create order through order service
    const newOrder = createOrder({
      user,
      item,
      qty,
      price,
      total,
      payment
    });

    // Update orders state
    setOrders([...orders, newOrder]);

    // Send notification
    const notificationMessage = notifyCustomer(user, newOrder.id, total, ['email', 'sms']);
    setMessage(`Order ${newOrder.id} placed. Total: $${total}`);
  }

  function handleRefund(orderId) {
    const updatedOrders = refundOrder(orderId, orders);
    setOrders(updatedOrders);
    setMessage(`Refund processed for order ${orderId}`);
  }

  function handleExportReport() {
    exportCSV(orders);
    const revenue = calculateRevenue(orders);
    setMessage(`Report exported. Total revenue: $${revenue.toFixed(2)}`);
  }

  return (
    <div className="page">
      <h1>E-Commerce Admin</h1>
      <p>SOLID principles refactored architecture.</p>

      <div className="card">
        <h2>Create Order</h2>
        <label>User</label>
        <input value={user} onChange={(e) => setUser(e.target.value)} />

        <label>Item</label>
        <select value={item} onChange={(e) => setItem(e.target.value)}>
          <option value="laptop">Laptop</option>
          <option value="phone">Phone</option>
          <option value="headset">Headset</option>
          <option value="misc">Misc</option>
        </select>

        <label>Quantity</label>
        <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />

        <label>Payment Method</label>
        <select value={payment} onChange={(e) => setPayment(e.target.value)}>
          {getAvailablePaymentMethods().map((method) => (
            <option key={method} value={method}>
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </option>
          ))}
        </select>

        <button onClick={handleBuyNow}>Buy Now</button>
        <button onClick={handleExportReport}>Export Report</button>
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
                <td>${o.total.toFixed(2)}</td>
                <td>{o.status}</td>
                <td>
                  <button
                    onClick={() => handleRefund(o.id)}
                    disabled={o.status === "REFUNDED"}
                  >
                    Refund
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
