import React, { useMemo, useState } from "react";
import { DiscountPolicy } from "./domain/discountPolicy";
import { OrderFactory } from "./domain/orderFactory";
import { OrderRepository } from "./repositories/orderRepository";
import { CardPaymentProcessor, CodPaymentProcessor, PaypalPaymentProcessor } from "./services/paymentProcessors";
import { PaymentService } from "./services/paymentService";
import { EmailNotifier, SmsNotifier } from "./services/notifiers";
import { NotificationService } from "./services/notificationService";
import { ReportService } from "./services/reportService";
import { OrderAppService } from "./adapters/orderAppService";
import OrderForm from "./ui/OrderForm";
import OrdersTable from "./ui/OrdersTable";

function createOrderAppService() {
  const orderRepository = new OrderRepository("orders");
  const discountPolicy = new DiscountPolicy();
  const orderFactory = new OrderFactory();

  const paymentService = new PaymentService({
    card: new CardPaymentProcessor(),
    paypal: new PaypalPaymentProcessor(),
    cod: new CodPaymentProcessor()
  });

  const notificationService = new NotificationService([new EmailNotifier(), new SmsNotifier()]);
  const reportService = new ReportService();

  return new OrderAppService({
    orderRepository,
    discountPolicy,
    orderFactory,
    paymentService,
    notificationService,
    reportService
  });
}

export default function App() {
  const appService = useMemo(() => createOrderAppService(), []);

  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");
  const [orders, setOrders] = useState(() => appService.loadOrders());
  const [message, setMessage] = useState("");

  async function buyNow() {
    try {
      const result = await appService.placeOrder({
        user,
        item,
        qty: Number(qty),
        payment
      });
      setOrders(result.orders);
      setMessage(result.message);
    } catch (error) {
      setMessage(error.message || "Payment failed");
    }
  }

  function refund(orderId) {
    const result = appService.refundOrder(orderId);
    setOrders(result.orders);
    setMessage(result.message);
  }

  function exportReport() {
    const result = appService.exportOrdersReport();
    setMessage(result.message);
  }

  return (
    <div className="page">
      <h1>Bad Commerce Admin (SOLID Refactor)</h1>
      <p>Refactored into domain, services, adapters, repositories, and UI components.</p>

      <OrderForm
        user={user}
        item={item}
        qty={qty}
        payment={payment}
        onUser={setUser}
        onItem={setItem}
        onQty={setQty}
        onPayment={setPayment}
        onBuy={buyNow}
        onExport={exportReport}
      />

      <OrdersTable orders={orders} onRefund={refund} />

      <p className="message">{message}</p>
    </div>
  );
}
