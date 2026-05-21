/**
 * OrderForm.jsx
 *
 * S — Single Responsibility: only renders the "Create Order" form and
 *     calls back to the parent with the form data. No business logic here.
 * I — Interface Segregation: receives only onSubmit and onExport — nothing
 *     about storage, pricing, or notifications.
 */

import React, { useState } from "react";

const ITEMS = ["laptop", "phone", "headset", "misc"];
const PAYMENT_METHODS = ["card", "paypal", "cod"];

/**
 * @param {{ onSubmit: Function, onExport: Function }} props
 */
export default function OrderForm({ onSubmit, onExport }) {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");

  function handleBuy() {
    onSubmit({ user, item, qty, payment });
  }

  return (
    <div className="card">
      <h2>Create Order</h2>

      <label>User</label>
      <input
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="username or 'vip'"
      />

      <label>Item</label>
      <select value={item} onChange={(e) => setItem(e.target.value)}>
        {ITEMS.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>

      <label>Qty</label>
      <input
        type="number"
        min="1"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />

      <label>Payment</label>
      <select value={payment} onChange={(e) => setPayment(e.target.value)}>
        {PAYMENT_METHODS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={handleBuy}>Buy</button>
        <button onClick={onExport}>Export CSV + Revenue</button>
      </div>
    </div>
  );
}
