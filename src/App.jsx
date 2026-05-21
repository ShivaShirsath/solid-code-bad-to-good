import React from "react";
import OrderForm from "./components/OrderForm";
import OrdersTable from "./components/OrdersTable";
import MessageBox from "./components/MessageBox";

import { useOrders } from "./hooks/useOrders";

import {
  calculatePrice
} from "./all_services/pricing/PricingService";

import {
  applyDiscount
} from "./all_services/pricing/DiscountService";

import {
  getPaymentProcessor
} from "./all_services/payment/PaymentProcessor";

import {
  sendEmail
} from "./all_services/notification/EmailService";

import {
  sendSMS
} from "./all_services/notification/SMSService";

import {
  exportReport
} from "./all_services/reports/ReportService";

import {
  createOrder
} from "./all_services/orders/OrderService";

import {
  refundOrder
} from "./all_services/orders/RefundService";

import { useState } from "react";

export default function App() {
  const { orders, setOrders } = useOrders();

  const [message, setMessage] = useState("");

  async function handleBuy(data) {
    const {
      user,
      item,
      qty,
      payment
    } = data;

    let total = calculatePrice(
      item,
      qty
    );

    total = applyDiscount(
      user,
      total,
      qty
    );

    const processor =
      getPaymentProcessor(payment);

    if (!processor) {
      setMessage(
        "Invalid payment method"
      );
      return;
    }

    console.log(processor.pay());

    const newOrder = createOrder({
      user,
      item,
      qty: Number(qty),
      total
    });

    setOrders([
      ...orders,
      newOrder
    ]);

    await sendEmail(
      `${user}@mail.com`,
      `Order ${newOrder.id} confirmed`
    );

    sendSMS(
      user,
      `Order ${newOrder.id} placed`
    );

    setMessage(
      `Order ${newOrder.id} placed. Total: ${total}`
    );
  }

  function handleRefund(orderId) {
    const next = refundOrder(
      orders,
      orderId
    );

    setOrders(next);

    setMessage(
      `Refund attempted for ${orderId}`
    );
  }

  function handleExport() {
    const revenue =
      exportReport(orders);

    setMessage(
      `Revenue: ${revenue}`
    );
  }

  return (
    <div className="page">
      <h1>
        SOLID Commerce Admin
      </h1>

      <p>
        Refactored using SOLID principles.
      </p>

      <OrderForm
        onBuy={handleBuy}
        onExport={handleExport}
      />

      <OrdersTable
        orders={orders}
        onRefund={handleRefund}
      />

      <MessageBox
        message={message}
      />
    </div>
  );
}