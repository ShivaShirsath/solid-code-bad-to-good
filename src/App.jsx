import React, { useState } from "react";
import { useOrders } from "./hooks/useOrders";

/**
 * Renders the original basic HTML structure and classes,
 * while utilizing the refactored SOLID custom hook under the hood.
 */
export default function App() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");

  const {
    orders,
    toast,
    placeOrder,
    refundOrder,
    exportCSVReport
  } = useOrders();

  function buyNow() {
    placeOrder({
      user,
      item,
      qty: Number(qty),
      paymentMethod: payment
    });
  }

  function refund(orderId) {
    refundOrder(orderId);
  }

  function exportReport() {
    exportCSVReport();
  }

  // Bind the SOLID hook toast alerts to the simple message text paragraph
  const message = toast ? toast.message : "";

  return (
    <div className="page">
      <h1>THE BEST E-COMMERCE APP</h1>
      <p>This is the best app for a e-commerce.</p>

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
