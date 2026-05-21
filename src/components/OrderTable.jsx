import React from "react";

export function OrderTable({ orders, onRefund }) {
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
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user}</td>
              <td>{order.item}</td>
              <td>{order.qty}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => onRefund(order.id)}>Refund</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
