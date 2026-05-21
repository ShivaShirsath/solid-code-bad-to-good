import React from "react";
import { PRODUCTS } from "../domain";

/**
 * Renders the tabular ledger of transactions.
 * 
 * @param {Object} props
 * @param {Array} props.orders - List of orders
 * @param {function} props.onRefund - Event handler when refund is requested
 */
export default function OrderTable({ orders = [], onRefund }) {
  const getProductDisplayName = (sku) => {
    const product = PRODUCTS[sku];
    return product ? product.name : sku;
  };

  return (
    <div className="card table-card">
      <div className="card-header">
        <h2>Transactions Ledger</h2>
        <p>Real-time audit log of local transactions and ledger statuses.</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>No transactions recorded in current ledger session.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Item SKU</th>
                <th>Qty</th>
                <th>Grand Total</th>
                <th>Ledger Status</th>
                <th>Audit Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isRefunded = order.status === "REFUNDED";
                return (
                  <tr key={order.id} className={isRefunded ? "row-refunded" : ""}>
                    <td className="col-id">#{order.id}</td>
                    <td className="col-user">{order.user}</td>
                    <td className="col-item">{getProductDisplayName(order.item)}</td>
                    <td className="col-qty">{order.qty}</td>
                    <td className="col-total">${order.total.toFixed(2)}</td>
                    <td className="col-status">
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="col-action">
                      <button
                        className="btn-action refund"
                        onClick={() => onRefund(order.id)}
                        disabled={isRefunded}
                        title={isRefunded ? "Transaction is already refunded" : "Initiate Refund"}
                      >
                        {isRefunded ? "Refunded" : "Refund"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
