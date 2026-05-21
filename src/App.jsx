import React, {  useState } from "react";
import { calculatePrice } from "./services/pricingService";
import { getPaymentProcessor } from "./services/payment/paymentFactory";
import { exportOrdersReport } from "./services/reportService";
import {
  sendEmailNotification,
  sendSMSNotification
} from "./services/notificationService";
import OrderForm from "./components/OrderForm";
import OrdersTable from "./components/OrdersTable";
import MessageBar from "./components/MessageBar";
import { useOrders } from "./hooks/useOrders";
// INTENTIONALLY BAD: massive component with UI + business logic + infra + reports + notifications + storage.
export default function App() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useOrders();

  function buyNow() {
    const total = calculatePrice(item, Number(qty), user);
    try {
      const processor = getPaymentProcessor(payment);
      processor.process();
    } catch (error) {
      setMessage("Payment failed");
      return;
    }

    const newOrder = {
      id: Date.now(),
      user,
      item,
      qty: Number(qty),
      total,
      status: "PLACED"
    };

    setOrders([...orders, newOrder]);

    // fake external side effects inside UI
    sendEmailNotification(newOrder);
    sendSMSNotification(newOrder);

    setMessage(`Order ${newOrder.id} placed. Total: ${total}`);
  }

  function refund(orderId) {
    const next = orders.map((o) => {
      if (o.id === orderId && o.status !== "REFUNDED") {
        return { ...o, status: "REFUNDED" };
      }
      return o;
    });
    setOrders(next);
    setMessage(`Refund attempted for ${orderId}`);
  }

  function exportReport() {
    const revenue = exportOrdersReport(orders);
    setMessage(`Revenue: ${revenue}`);
  }

  return (
    <div className="page">
      <h1>Bad Commerce Admin</h1>
      <p>Intentionally bad architecture for SOLID refactoring exercise.</p>

      <OrderForm
        user={user}
        setUser={setUser}
        item={item}
        setItem={setItem}
        qty={qty}
        setQty={setQty}
        payment={payment}
        setPayment={setPayment}
        onBuy={buyNow}
        onExport={exportReport}
      />

      <OrdersTable
        orders={orders}
        onRefund={refund}
      />

      <MessageBar message={message} />
    </div>
  );
}

