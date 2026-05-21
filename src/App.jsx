import React from "react";
import { useOrders }  from "./hooks/useOrders";
import OrderForm      from "./components/OrderForm";
import OrderTable     from "./components/OrderTable";
import StatusMessage  from "./components/StatusMessage";

export default function App() {
  const { orders, message, placeOrder, refundOrder, exportReport } = useOrders();

  return (
    <div className="page">
      <h1>Commerce Admin</h1>
      <p>Refactored — SOLID architecture.</p>

      <OrderForm onSubmit={placeOrder} />
      <button onClick={exportReport}>Export CSV + Revenue</button>

      <OrderTable orders={orders} onRefund={refundOrder} />
      <StatusMessage message={message} />
    </div>
  );
}