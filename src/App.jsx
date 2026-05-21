import React, { useState } from "react";
import CreateOrderForm from "./components/CreateOrderForm.jsx";
import OrdersTable from "./components/OrdersTable.jsx";
import { useCheckout } from "./hooks/useCheckout.js";
import { useOrders } from "./hooks/useOrders.js";
import {
  buildRevenueSummary,
  exportOrdersCsv,
} from "./services/reporting/csvOrderReport.js";

export default function App() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");
  const [message, setMessage] = useState("");

  const { orders, addOrder, refund } = useOrders();
  const { checkout } = useCheckout({ addOrder });

  async function handleBuy() {
    const result = await checkout({ user, item, qty, payment });
    setMessage(result.message);
  }

  function handleRefund(orderId) {
    refund(orderId);
    setMessage(`Refund attempted for ${orderId}`);
  }

  function handleExport() {
    exportOrdersCsv(orders);
    setMessage(`Revenue: ${buildRevenueSummary(orders)}`);
  }

  return (
    <div className="page">
      <h1>Commerce Admin</h1>
      <p>Refactored for SOLID: domain, services, hooks, and view components.</p>

      <CreateOrderForm
        user={user}
        item={item}
        qty={qty}
        payment={payment}
        onUserChange={setUser}
        onItemChange={setItem}
        onQtyChange={setQty}
        onPaymentChange={setPayment}
        onBuy={handleBuy}
        onExport={handleExport}
      />

      <OrdersTable orders={orders} onRefund={handleRefund} />

      <p className="message">{message}</p>
    </div>
  );
}
