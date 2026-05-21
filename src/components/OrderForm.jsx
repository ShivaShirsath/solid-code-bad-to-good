import React, { useState } from "react";
import { PRODUCTS } from "../domain";

/**
 * Renders the order creation panel.
 * 
 * @param {Object} props
 * @param {function} props.onPlaceOrder - Action trigger for buying
 * @param {function} props.onExportCSV - Action trigger for CSV generation
 * @param {boolean} props.isProcessing - Disabled state during checkout
 */
export default function OrderForm({ onPlaceOrder, onExportCSV, isProcessing }) {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onPlaceOrder({
      user,
      item,
      qty: Number(qty),
      paymentMethod: payment
    });

    if (success) {
      // Reset form quantity, keep user for easier repeated test placements
      setQty(1);
    }
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h2>Create Terminal Order</h2>
        <p>Queue and dispatch transactions directly to ledger registries.</p>
      </div>

      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label htmlFor="user-input">Customer Username</label>
          <input
            id="user-input"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            disabled={isProcessing}
            required
            placeholder="Enter customer name..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-select">Select Product</label>
          <select
            id="product-select"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            disabled={isProcessing}
          >
            {Object.entries(PRODUCTS).map(([sku, product]) => (
              <option key={sku} value={sku}>
                {product.name} (${product.basePrice.toFixed(0)})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="qty-input">Quantity</label>
          <input
            id="qty-input"
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            disabled={isProcessing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="payment-select">Payment Method</label>
          <select
            id="payment-select"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            disabled={isProcessing}
          >
            <option value="card">Credit/Debit Card</option>
            <option value="paypal">PayPal Gateway</option>
            <option value="cod">Cash On Delivery (COD)</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Place Order"}
          </button>
          
          <button
            type="button"
            className="btn-secondary"
            onClick={onExportCSV}
            disabled={isProcessing}
          >
            Export Ledger CSV
          </button>
        </div>
      </form>
    </div>
  );
}
