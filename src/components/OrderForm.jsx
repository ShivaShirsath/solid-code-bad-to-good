import React from "react";
import { useState } from "react";

export default function OrderForm({ onSubmit }) {
  const [form, setForm] = useState({
    user:    "vip",
    item:    "laptop",
    qty:     1,
    payment: "card",
  });

  const set = (key) => (e) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="card">
      <h2>Create Order</h2>

      <label>User</label>
      <input value={form.user} onChange={set("user")} />

      <label>Item</label>
      <select value={form.item} onChange={set("item")}>
        {["laptop", "phone", "headset", "misc"].map(i => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>

      <label>Qty</label>
      <input type="number" value={form.qty} onChange={set("qty")} />

      <label>Payment</label>
      <select value={form.payment} onChange={set("payment")}>
        {["card", "paypal", "cod"].map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <button onClick={() => onSubmit(form)}>Buy</button>
    </div>
  );
}