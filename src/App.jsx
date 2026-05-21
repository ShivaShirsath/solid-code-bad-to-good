/**
 * App — thin orchestrator.
 *
 * Responsibilities:
 *  - Compose the page layout.
 *  - Wire the useOrders hook to child components.
 *
 * No business logic, no storage, no HTTP, no CSV — all delegated.
 */

import React from "react";
import { useOrders } from "./hooks/useOrders.js";
import OrderForm from "./components/OrderForm.jsx";
import OrderTable from "./components/OrderTable.jsx";
import StatusMessage from "./components/StatusMessage.jsx";

export default function App() {
  const { orders, message, busy, handlePlaceOrder, handleRefund, handleExport } =
    useOrders();

  return (
    <div className="page">
      <h1>Commerce Admin</h1>

      <OrderForm onSubmit={handlePlaceOrder} disabled={busy} />

      <OrderTable
        orders={orders}
        onRefund={handleRefund}
        onExport={handleExport}
      />

      <StatusMessage message={message} />
    </div>
  );
}
