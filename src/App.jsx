import React from "react";
import OrderForm from "./components/OrderForm";
import OrderTable from "./components/OrderTable";
import { useOrders } from "./hooks/useOrders";

import { PricingService } from "./services/PricingService";
import { PaymentService } from "./services/PaymentService";
import { NotificationService } from "./services/NotificationService";
import { ReportService } from "./services/ReportService";
import { RefundService } from "./services/RefundService";

export default function App() {

  const { orders, setOrders } = useOrders();

  function handleBuy({
    user,
    item,
    qty,
    payment
  }) {

    const total =
      PricingService.calculate(
        item,
        qty,
        user
      );

    PaymentService.process(payment);

    const order = {
      id: Date.now(),
      user,
      item,
      qty,
      total,
      status: "PLACED"
    };

    setOrders([...orders, order]);

    NotificationService.sendEmail(
      user,
      order.id
    );

    NotificationService.sendSMS(
      user,
      order.id
    );
  }

  function handleRefund(orderId) {

    const updated =
      RefundService.refund(
        orders,
        orderId
      );

    setOrders(updated);
  }

  function handleExport() {

    const revenue =
      ReportService.exportCSV(orders);

    console.log(revenue);
  }

  return (
    <div>
      <OrderForm
        onBuy={handleBuy}
        onExport={handleExport}
      />

      <OrderTable
        orders={orders}
        onRefund={handleRefund}
      />
    </div>
  );
}