// Presentational component only: it shows the order list and refund action.
// SOLID: Interface Segregation - it receives only the props it needs.
export default function OrdersTable({ orders, onRefund }) {
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
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7">No orders yet.</td>
            </tr>
          ) : (
            orders.map((o) => (
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}