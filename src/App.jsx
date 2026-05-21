import React, { useState } from "react";
import { useOrders }    from "./hooks/useOrders.js";
import OrderForm        from "./components/OrderForm.jsx";
import OrderTable       from "./components/OrderTable.jsx";

export default function App() {
  const [form, setForm] = useState({
    user: "vip",
    item: "laptop",
    qty: 1,
    payment: "card",
  });

  const { orders, message, placeOrder, refundOrder, exportReport } = useOrders();

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    placeOrder(form.user, form.item, form.qty, form.payment);
  }

  return (
    <div className="page">
      <h1>Commerce Admin</h1>
      <p>Refactored to follow SOLID principles.</p>

      <OrderForm
        user={form.user}
        item={form.item}
        qty={form.qty}
        payment={form.payment}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onExport={exportReport}
      />

      <OrderTable orders={orders} onRefund={refundOrder} />

      <p className="message">{message}</p>
    </div>
  );
}
