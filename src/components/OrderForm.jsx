import React from "react";

export default function OrderForm({ user, item, qty, payment, onInput }) {
  return (
    <div className="card">
      <h2>Create Order</h2>

      <label>User</label>
      <input name="user" value={user} onChange={onInput} />

      <label>Item</label>
      <select name="item" value={item} onChange={onInput}>
        <option value="laptop">laptop</option>
        <option value="phone">phone</option>
        <option value="headset">headset</option>
        <option value="misc">misc</option>
      </select>

      <label>Qty</label>
      <input type="number" name="qty" value={qty} onChange={onInput} />

      <label>Payment</label>
      <select name="payment" value={payment} onChange={onInput}>
        <option value="card">card</option>
        <option value="paypal">paypal</option>
        <option value="cod">cod</option>
      </select>
    </div>
  );
}
