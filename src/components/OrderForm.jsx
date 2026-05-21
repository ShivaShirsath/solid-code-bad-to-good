import React from "react";
import { ITEMS, PAYMENT_METHODS } from "../constants";

export default function OrderForm({ user, item, qty, payment, handlers, onBuy, onExport, displayTotal }) {
  const { handleUserChange, handleItemChange, handleQtyChange, handlePaymentChange } = handlers;

  return (
    <>
      <div className="card">
        <h2>Create Order</h2>
        <label>User</label>
        <input value={user} onChange={handleUserChange} />

        <label>Item</label>
        <select value={item} onChange={handleItemChange}>
          {ITEMS.map(i => <option key={i} value={i}>{i}</option>)}
        </select>

        <label>Qty</label>
        <input type="number" value={qty} onChange={handleQtyChange} />

        <label>Payment</label>
        <select value={payment} onChange={handlePaymentChange}>
          {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <button onClick={onBuy}>Buy</button>
        <button onClick={onExport}>Export CSV + Revenue</button>
      </div>

      <div className="card" style={{ padding: "10px", textAlign: "center", backgroundColor: "#f0f0f0" }}>
        <strong>Estimated Total: ${displayTotal}</strong>
      </div>
    </>
  );
}
