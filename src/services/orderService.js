import { calculateTotal } from "./paymentService";
import { createPayment } from "../payments/paymentFactory";
import { sendEmail, sendSMS } from "../infra/notificationService";

export async function createOrder({
  user,
  item,
  qty,
  payment
}) {
  const total = calculateTotal(user, item, qty);

  const paymentProcessor = createPayment(payment);
  paymentProcessor.process();

  const order = {
    id: Date.now(),
    user,
    item,
    qty,
    total,
    status: "PLACED"
  };

  await sendEmail(user, order.id);
  sendSMS(user, order.id);

  return order;
}

export function refundOrder(orders, orderId) {
  return orders.map((o) =>
    o.id === orderId && o.status !== "REFUNDED"
      ? { ...o, status: "REFUNDED" }
      : o
  );
}