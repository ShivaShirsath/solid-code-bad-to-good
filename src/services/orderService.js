/**
 * Order service — orchestrates the place-order and refund flows.
 *
 * SRP: this module owns the business workflow only.
 * It delegates pricing → domain/pricing, payment → paymentService,
 * notifications → notificationService, and persistence → storageAdapter.
 *
 * DIP: depends on injected adapters (storage) and imported service
 * functions, not on React state or DOM APIs.
 */

import { calculateTotal } from "../domain/pricing.js";
import { createOrder } from "../domain/orderFactory.js";
import { processPayment } from "./paymentService.js";
import { notifyOrderPlaced } from "./notificationService.js";

/**
 * Places a new order.
 *
 * @param {{ user, item, qty, paymentMethod }} params
 * @param {Order[]} currentOrders  - current order list (immutable input)
 * @returns {Promise<{ ok: boolean, message: string, orders?: Order[] }>}
 */
export async function placeOrder({ user, item, qty, paymentMethod }, currentOrders) {
  const total = calculateTotal(item, Number(qty), user);
  const order = createOrder({ user, item, qty: Number(qty), total });

  const payment = await processPayment(paymentMethod, order);
  if (!payment.success) {
    return { ok: false, message: payment.message };
  }

  const updatedOrders = [...currentOrders, order];

  // Fire-and-forget notifications; don't block the order confirmation.
  notifyOrderPlaced(order);

  return {
    ok: true,
    message: `Order ${order.id} placed. Total: $${total.toFixed(2)}`,
    orders: updatedOrders,
  };
}

/**
 * Marks an order as REFUNDED.
 *
 * @param {number} orderId
 * @param {Order[]} currentOrders
 * @returns {{ message: string, orders: Order[] }}
 */
export function refundOrder(orderId, currentOrders) {
  const orders = currentOrders.map((o) =>
    o.id === orderId && o.status !== "REFUNDED" ? { ...o, status: "REFUNDED" } : o
  );
  return { message: `Refund processed for order ${orderId}`, orders };
}
