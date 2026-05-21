import React from "react";
export default function OrderTable({ orders, onRefund }) {
  return (
    <div className="card">
      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            {["ID", "User", "Item", "Qty", "Total", "Status", "Action"].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user}</td>
              <td>{o.item}</td>
              <td>{o.qty}</td>
              <td>{o.total}</td>
              <td>{o.status}</td>
              <td>
                <button onClick={() => onRefund(o.id)}>Refund</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}