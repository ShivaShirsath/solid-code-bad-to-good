/**
 * App.jsx — Composition Root
 *
 * This file's only job is to wire components and the hook together.
 * It contains zero business logic.
 *
 * SOLID summary
 * ─────────────
 * S  Single Responsibility  — each file has one reason to change
 * O  Open/Closed            — add items/payments/discounts by extending
 *                             config maps, not by editing existing code
 * L  Liskov Substitution    — all payment processors share the same
 *                             { process(order) } interface
 * I  Interface Segregation  — components receive only the props they use
 * D  Dependency Inversion   — components depend on the useOrders hook
 *                             abstraction, not on concrete services
 */

import React from "react";
import { useOrders } from "./hooks/useOrders";
import OrderForm from "./components/OrderForm";
import OrderTable from "./components/OrderTable";
import StatusMessage from "./components/StatusMessage";

export default function App() {
  const { orders, message, placeOrder, refundOrder, exportReport } = useOrders();

  return (
    <div className="page">
      <h1>SOLID Commerce Admin</h1>
      <p>Refactored from a single monolithic component into SOLID modules.</p>

      <OrderForm onSubmit={placeOrder} onExport={exportReport} />
      <OrderTable orders={orders} onRefund={refundOrder} />
      <StatusMessage text={message} />
    </div>
  );
}
