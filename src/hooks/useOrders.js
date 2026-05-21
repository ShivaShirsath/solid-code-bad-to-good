import { useEffect, useState }        from "react";
import { getBasePrice, applyDiscount } from "../domain/pricing.js";
import { createOrder }                 from "../domain/orderFactory.js";
import { getPaymentGateway }           from "../services/payment/paymentRegistry.js";
import { notifyAll }                   from "../services/notification/notifierRegistry.js";
import { loadOrders, saveOrders }      from "../services/storage/localStorageRepo.js";
import { exportOrdersCsv }             from "../services/reporting/csvExporter.js";

export function useOrders() {
  const [orders,  setOrders]  = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  function placeOrder(user, item, qty, payment) {
    const base     = getBasePrice(item);
    const subtotal = base * Number(qty);
    const total    = applyDiscount(subtotal, user, Number(qty));

    const gateway = getPaymentGateway(payment);
    if (!gateway) {
      setMessage("Payment method not supported.");
      return;
    }
    const success = gateway.process({ id: Date.now(), total });
    if (!success) {
      setMessage("Payment failed.");
      return;
    }

    const order = createOrder(user, item, qty, total);
    setOrders((prev) => [...prev, order]);
    notifyAll(order);
    setMessage(`Order ${order.id} placed. Total: $${total.toFixed(2)}`);
  }

  function refundOrder(orderId) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId && o.status !== "REFUNDED"
          ? { ...o, status: "REFUNDED" }
          : o
      )
    );
    setMessage(`Refund initiated for order ${orderId}`);
  }

  function exportReport() {
    const revenue = exportOrdersCsv(orders);
    setMessage(`CSV exported. Total revenue: $${revenue.toFixed(2)}`);
  }

  return { orders, message, placeOrder, refundOrder, exportReport };
}
