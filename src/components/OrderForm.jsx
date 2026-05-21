import React from "react";

export function OrderForm({ formState, onFieldChange, onBuy, onExport }) {
  return (
    <div className="card">
      <h2>Create Order</h2>

      <label>User</label>
      <input value={formState.user} onChange={(e) => onFieldChange("user", e.target.value)} />

      <label>Item</label>
      <select value={formState.item} onChange={(e) => onFieldChange("item", e.target.value)}>
        <option value="laptop">laptop</option>
        <option value="phone">phone</option>
        <option value="headset">headset</option>
        <option value="misc">misc</option>
      </select>

      <label>Qty</label>
      <input type="number" value={formState.qty} onChange={(e) => onFieldChange("qty", e.target.value)} />

      <label>Payment</label>
      <select value={formState.payment} onChange={(e) => onFieldChange("payment", e.target.value)}>
        <option value="card">card</option>
        <option value="paypal">paypal</option>
        <option value="cod">cod</option>
      </select>

      <button onClick={onBuy}>Buy</button>
      <button onClick={onExport}>Export CSV + Revenue</button>
    </div>
  );
}
