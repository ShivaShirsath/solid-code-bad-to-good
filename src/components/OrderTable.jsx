/**
 * OrderTable — view-only component.
 *
 * SRP: renders the orders list and exposes a refund action per row.
 * No business logic, no storage, no formatting beyond display.
 */

import React from "react";

export default function OrderTable({ orders, onRefund, onExport }) {
  return (
    <div className="card">
      <div className="table-header">
        <h2>Orders</h2>
        <button onClick={onExport}>Export CSV + Revenue</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", color: "#888" }}>
                No orders yet.
              </td>
            </tr>
          )}
          {orders.map((o) => (
            <tr key={o.id} className={o.status === "REFUNDED" ? "refunded" : ""}>
              <td>{o.id}</td>
              <td>{o.user}</td>
              <td>{o.item}</td>
              <td>{o.qty}</td>
              <td>${o.total.toFixed(2)}</td>
              <td>{o.status}</td>
              <td>
                <button
                  onClick={() => onRefund(o.id)}
                  disabled={o.status === "REFUNDED"}
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
