import React, { useEffect, useState } from "react";
import { calculateOrderTotal } from "./services/pricingService";
import { paymentGateway } from "./services/paymentService";
import { notificationService } from "./services/notificationService";
import { localOrderRepository } from "./services/orderRepository";
import { exportOrdersCsv } from "./services/reportExporter";
import { OrderForm } from "./components/OrderForm";
import { OrderTable } from "./components/OrderTable";
import { MessageDisplay } from "./components/MessageDisplay";

const DEFAULT_ORDER = {
  user: "vip",
  item: "laptop",
  qty: 1,
  payment: "card"
};

export default function App() {
  const [formState, setFormState] = useState(DEFAULT_ORDER);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localOrderRepository.loadOrders();
    setOrders(stored);
  }, []);

  useEffect(() => {
    localOrderRepository.saveOrders(orders);
  }, [orders]);

  const updateField = (field, value) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const buyNow = async () => {
    try {
      const total = calculateOrderTotal(formState);
      paymentGateway.pay(formState.payment, total);

      const order = {
        id: Date.now(),
        user: formState.user,
        item: formState.item,
        qty: Number(formState.qty),
        total,
        status: "PLACED"
      };

      const nextOrders = [...orders, order];
      setOrders(nextOrders);
      setMessage(`Order ${order.id} placed. Total: ${total}`);

      await notificationService.notify(`${order.user}@mail.com`, `Order ${order.id} confirmed`);
    } catch (error) {
      setMessage(error.message || "Unable to complete payment");
    }
  };

  const refund = (orderId) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId && order.status !== "REFUNDED"
          ? { ...order, status: "REFUNDED" }
          : order
      )
    );
    setMessage(`Refund attempted for ${orderId}`);
  };

  const exportReport = () => {
    exportOrdersCsv(orders);
    const revenue = orders.reduce((sum, order) => sum + (order.status !== "REFUNDED" ? order.total : 0), 0);
    setMessage(`Revenue: ${revenue}`);
  };

  return (
    <div className="page">
      <h1>Commerce Admin</h1>
      <p>Refactored to separate UI, business logic, payments, notifications, storage, and export.</p>

      <OrderForm
        formState={formState}
        onFieldChange={updateField}
        onBuy={buyNow}
        onExport={exportReport}
      />

      <OrderTable
        orders={orders}
        onRefund={refund}
      />

      <MessageDisplay message={message} />
    </div>
  );
}
