/**
 * OrderTable.jsx
 *
 * S — Single Responsibility: only renders the orders list and exposes
 *     a refund action. No pricing, storage, or notification logic.
 * I — Interface Segregation: receives only the data it needs (orders)
 *     and the one callback it triggers (onRefund).
 */

import React from "react";

const STATUS_COLORS = {
  PLACED: "#2563eb",
  REFUNDED: "#dc2626",
};

/**
 * @param {{ orders: Array, onRefund: Function }} props
 */
export default function OrderTable({ orders, onRefund }) {
  if (orders.length === 0) {
    return (
      <div className="card">
        <h2>Orders</h2>
        <p style={{ color: "#888" }}>No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Total ($)</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user}</td>
              <td>{o.item}</td>
              <td>{o.qty}</td>
              <td>{o.total.toFixed(2)}</td>
              <td style={{ color: STATUS_COLORS[o.status] ?? "#333", fontWeight: "bold" }}>
                {o.status}
              </td>
              <td>
                <button
                  onClick={() => onRefund(o.id)}
                  disabled={o.status === "REFUNDED"}
                  style={{ opacity: o.status === "REFUNDED" ? 0.4 : 1 }}
                >
                  Refund
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
