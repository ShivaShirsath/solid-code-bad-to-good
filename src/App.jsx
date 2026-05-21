import React, { useEffect, useState } from "react";

// Refactored to follow SOLID principles. See inline comments for rationale.
import OrderForm from "./components/OrderForm";
import OrdersTable from "./components/OrdersTable";
import StorageService from "./infra/storage/storageService";
import PaymentService from "./payments/paymentService";
import { defaultPaymentStrategies } from "./payments/defaultStrategies";
import NotificationService from "./infra/notification/notificationService";
import OrderService from "./services/orderService";
import ReportService from "./services/reportService";

// Create concrete implementations / strategies once.
// Placing these at module level avoids recreating them on each render.
const storage = new StorageService();

const payment = new PaymentService(defaultPaymentStrategies);

const notification = new NotificationService();
const orderService = new OrderService({ storage, payment, notification });
const reportService = new ReportService();

export default function App() {
  // UI state only: values and a local copy of orders for rendering.
  // Single Responsibility: this component now only handles rendering and user interactions.
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // load orders from storage via OrderService (Dependency Inversion)
    setOrders(orderService.getAll());
  }, []);

  function buyNow() {
    // Delegate business logic and side effects to OrderService.
    // This keeps the UI open for extension (Open/Closed) and smaller (Single Responsibility).
    const result = orderService.createOrder({ user, item, qty, paymentMethod });
    if (!result.success) {
      setMessage("Payment failed");
      return;
    }

    // refresh local orders from storage implementation
    setOrders(orderService.getAll());
    setMessage(`Order ${result.order.id} placed. Total: ${result.order.total}`);
  }

  function refund(orderId) {
    // Refund is handled by OrderService; UI doesn't mutate order shape directly.
    orderService.refund(orderId);
    setOrders(orderService.getAll());
    setMessage(`Refund attempted for ${orderId}`);
  }

  function exportReport() {
    // Report generation delegated to ReportService (Single Responsibility)
    reportService.exportCSV(orders);
    const rev = reportService.revenue(orders);
    setMessage(`Revenue: ${rev}`);
  }

  return (
    <div className="page">
      <h1>Commerce Admin (Refactored for SOLID)</h1>
      <p>UI lives in components; services, payments, utils, and infra are now separated by folder.</p>

      <OrderForm
        user={user}
        item={item}
        qty={qty}
        paymentMethod={paymentMethod}
        onUserChange={setUser}
        onItemChange={setItem}
        onQtyChange={setQty}
        onPaymentMethodChange={setPaymentMethod}
        onBuy={buyNow}
        onExport={exportReport}
      />

      <OrdersTable orders={orders} onRefund={refund} />

      <p className="message">{message}</p>
    </div>
  );
}
