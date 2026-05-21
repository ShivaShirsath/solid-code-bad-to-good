import React, { useEffect, useState } from "react";

import OrderForm from "./components/OrderForm";
import OrdersTable from "./components/OrdersTable";

import { loadOrders, saveOrders } from "./infra/storage";

import {
  createOrder,
  refundOrder
} from "./services/orderService";

import { exportCSV } from "./services/reportService";

export default function App() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  async function handleBuy(orderData) {
    try {
      const order = await createOrder(orderData);

      setOrders((prev) => [...prev, order]);

      setMessage(
        `Order ${order.id} placed. Total: ${order.total}`
      );
    } catch (err) {
      setMessage(err.message);
    }
  }

  function handleRefund(orderId) {
    setOrders((prev) => refundOrder(prev, orderId));

    setMessage(`Refund attempted for ${orderId}`);
  }

  function handleExport() {
    const revenue = exportCSV(orders);

    setMessage(`Revenue: ${revenue}`);
  }

  return (
    <div className="page">
      <h1>SOLID Commerce Admin</h1>

      <OrderForm
        onBuy={handleBuy}
        onExport={handleExport}
      />

      <OrdersTable
        orders={orders}
        onRefund={handleRefund}
      />

      <p>{message}</p>
    </div>
  );
}