/**
 * OrderForm — view-only component.
 *
 * SRP: renders the order creation form and calls onSubmit with raw form data.
 * Zero business logic lives here.
 */

import React, { useState } from "react";
import { getSupportedPaymentMethods } from "../services/paymentService.js";

const ITEMS = ["laptop", "phone", "headset", "misc"];
const PAYMENT_METHODS = getSupportedPaymentMethods();

export default function OrderForm({ onSubmit, disabled }) {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState(PAYMENT_METHODS[0]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ user, item, qty: Number(qty), paymentMethod: payment });
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Create Order</h2>

      <label htmlFor="user">User</label>
      <input
        id="user"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        required
      />

      <label htmlFor="item">Item</label>
      <select id="item" value={item} onChange={(e) => setItem(e.target.value)}>
        {ITEMS.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>

      <label htmlFor="qty">Qty</label>
      <input
        id="qty"
        type="number"
        min="1"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        required
      />

      <label htmlFor="payment">Payment</label>
      <select id="payment" value={payment} onChange={(e) => setPayment(e.target.value)}>
        {PAYMENT_METHODS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <button type="submit" disabled={disabled}>
        {disabled ? "Processing…" : "Buy"}
      </button>
    </form>
  );
}
