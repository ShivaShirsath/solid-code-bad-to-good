import React, { useState } from "react";
import { useOrders } from "./hooks/useOrders";
import { PricingService } from "./services/PricingService";
import { PaymentProcessor } from "./services/PaymentStrategies";
import { NotificationService } from "./services/NotificationService";
import { ReportService } from "./services/ReportService";

export default function App() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");
  const [message, setMessage] = useState("");

  const { orders, addOrder, refundOrder } = useOrders();

  function buyNow() {
    const total = PricingService.calculateTotal(item, qty, user);

    const paymentSuccess = PaymentProcessor.executePayment(payment, total);
    
    if (!paymentSuccess) {
      setMessage("Payment failed");
      return;
    }

    const newOrder = {
      id: Date.now(),
      user,
      item,
      qty: Number(qty),
      total,
      status: "PLACED"
    };

    addOrder(newOrder);
    NotificationService.sendOrderConfirmation(user, newOrder.id);
    setMessage(`Order ${newOrder.id} placed. Total: ${total}`);
  }

  function handleRefund(orderId) {
    refundOrder(orderId);
    setMessage(`Refund attempted for ${orderId}`);
  }

  function handleExport() {
    const revenue = ReportService.exportOrdersCSV(orders);
    setMessage(`Revenue: ${revenue}`);
  }

  return (
    <div className="page">
      <h1>Good Commerce Admin</h1>
      <p>Refactored architecture using SOLID principles.</p>

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
        <button onClick={handleExport}>Export CSV + Revenue</button>
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
                  <button onClick={() => handleRefund(o.id)}>Refund</button>
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
