import React,{ useState } from "react";

export default function OrderForm({ onBuy, onExport }) {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");

  function handleSubmit() {
    onBuy({
      user,
      item,
      qty: Number(qty),
      payment
    });
  }

  return (
    <div className="card">
      <h2>Create Order</h2>

      <input value={user} onChange={(e) => setUser(e.target.value)} />

      <select value={item} onChange={(e) => setItem(e.target.value)}>
        <option value="laptop">laptop</option>
        <option value="phone">phone</option>
        <option value="headset">headset</option>
        <option value="misc">misc</option>
      </select>

      <input
        type="number"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />

      <select
        value={payment}
        onChange={(e) => setPayment(e.target.value)}
      >
        <option value="card">card</option>
        <option value="paypal">paypal</option>
        <option value="cod">cod</option>
      </select>

      <button onClick={handleSubmit}>Buy</button>

      <button onClick={onExport}>Export CSV</button>
    </div>
  );
}