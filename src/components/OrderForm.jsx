import React from "react";

export function OrderForm({
  user,
  item,
  qty,
  payment,
  onUserChange,
  onItemChange,
  onQtyChange,
  onPaymentChange,
  onBuy,
  onExport
}) {
  return (
    <div className="card">
      <h2>Create Order</h2>

      <label>User</label>
      <input value={user} onChange={(e) => onUserChange(e.target.value)} />

      <label>Item</label>
      <select value={item} onChange={(e) => onItemChange(e.target.value)}>
        <option value="laptop">laptop</option>
        <option value="phone">phone</option>
        <option value="headset">headset</option>
        <option value="misc">misc</option>
      </select>

      <label>Qty</label>
      <input
        type="number"
        min="1"
        value={qty}
        onChange={(e) => onQtyChange(Number(e.target.value))}
      />

      <label>Payment</label>
      <select value={payment} onChange={(e) => onPaymentChange(e.target.value)}>
        <option value="card">card</option>
        <option value="paypal">paypal</option>
        <option value="cod">cod</option>
      </select>

      <button type="button" onClick={onBuy}>
        Buy
      </button>
      <button type="button" onClick={onExport}>
        Export CSV + Revenue
      </button>
    </div>
  );
}
