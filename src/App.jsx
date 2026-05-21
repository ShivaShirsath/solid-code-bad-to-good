import React from "react";
import OrderForm from "./components/OrderForm";
import OrdersTable from "./components/OrdersTable";
import StatsBar from "./components/StatsBar";
import MessageDisplay from "./components/MessageDisplay";
import { useOrders } from "./hooks/useOrders";
import { useOrderForm } from "./hooks/useOrderForm";
import { useMessage } from "./hooks/useMessage";
import { useOrderStats } from "./hooks/useOrderStats";
import { useDisplayTotal } from "./hooks/useDisplayTotal";
import { useOrderOperations } from "./hooks/useOrderOperations";

export default function App() {
  // Custom hooks - separated concerns
  const [orders, setOrders] = useOrders();
  const orderForm = useOrderForm();
  const [message, setMessage] = useMessage();
  const stats = useOrderStats(orders);
  const displayTotal = useDisplayTotal(orderForm.item, orderForm.qty, orderForm.user);
  
  const operations = useOrderOperations(
    { user: orderForm.user, item: orderForm.item, qty: orderForm.qty, payment: orderForm.payment },
    orders,
    setOrders,
    setMessage
  );

  return (
    <div className="page">
      <h1>Optimized Commerce Admin</h1>
      <p>Refactored SOLID architecture with modular structure.</p>

      <StatsBar stats={stats} />

      <OrderForm
        user={orderForm.user}
        item={orderForm.item}
        qty={orderForm.qty}
        payment={orderForm.payment}
        handlers={orderForm.handlers}
        onBuy={operations.buyNow}
        onExport={operations.exportReport}
        displayTotal={displayTotal}
      />

      <OrdersTable orders={orders} onRefund={operations.refund} />

      <MessageDisplay message={message} />
    </div>
  );
}