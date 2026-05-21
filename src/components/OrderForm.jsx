import React, { useState } from 'react';

export default function OrderForm({ initial = {}, onBuy, onExport }) {
  const [user, setUser] = useState(initial.user ?? 'vip');
  const [item, setItem] = useState(initial.item ?? 'laptop');
  const [qty, setQty] = useState(initial.qty ?? 1);
  const [payment, setPayment] = useState(initial.payment ?? 'card');

  return (
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

      <button onClick={() => onBuy({ user, item, qty, payment })}>Buy</button>
      <button onClick={onExport}>Export CSV + Revenue</button>
    </div>
  );
}
