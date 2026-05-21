import React from "react";

export default function OrderForm({ user, item, qty, payment, onChange, onSubmit, onExport }) {
  return (
    <div className="card">
      <h2>Create Order</h2>

      <label>User</label>
      <input
        value={user}
        onChange={(e) => onChange("user", e.target.value)}
      />

      <label>Item</label>
      <select value={item} onChange={(e) => onChange("item", e.target.value)}>
        <option value="laptop">laptop</option>
        <option value="phone">phone</option>
        <option value="headset">headset</option>
        <option value="misc">misc</option>
      </select>

      <label>Qty</label>
      <input
        type="number"
        value={qty}
        onChange={(e) => onChange("qty", e.target.value)}
      />

      <label>Payment</label>
      <select value={payment} onChange={(e) => onChange("payment", e.target.value)}>
        <option value="card">card</option>
        <option value="paypal">paypal</option>
        <option value="cod">cod</option>
      </select>

      <div>
        <button onClick={onSubmit}>Buy</button>
        <button onClick={onExport}>Export CSV + Revenue</button>
      </div>
    </div>
  );
}
