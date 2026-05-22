import React from "react";

export default function OrderForm({ user, item, qty, payment, onUser, onItem, onQty, onPayment, onBuy, onExport }) {
  return (
    <div className="card">
      <h2>Create Order</h2>
      <label>User</label>
      <input value={user} onChange={(e) => onUser(e.target.value)} />

      <label>Item</label>
      <select value={item} onChange={(e) => onItem(e.target.value)}>
        <option value="laptop">laptop</option>
        <option value="phone">phone</option>
        <option value="headset">headset</option>
        <option value="misc">misc</option>
      </select>

      <label>Qty</label>
      <input type="number" value={qty} onChange={(e) => onQty(e.target.value)} />

      <label>Payment</label>
      <select value={payment} onChange={(e) => onPayment(e.target.value)}>
        <option value="card">card</option>
        <option value="paypal">paypal</option>
        <option value="cod">cod</option>
      </select>

      <button onClick={onBuy}>Buy</button>
      <button onClick={onExport}>Export CSV + Revenue</button>
    </div>
  );
}
