import React, { useEffect, useState } from "react";
import { LocalStorageOrderRepository } from "../repositories/orderRepository";
import {
  CardPaymentProcessor,
  CashOnDeliveryProcessor,
  PaypalPaymentProcessor,
  PaymentService,
} from "../services/paymentService";
import { NotificationService } from "../services/notificationService";
import { OrderApplicationService } from "../services/orderApplicationService";

const orderRepository = new LocalStorageOrderRepository();
const paymentService = new PaymentService({
  card: new CardPaymentProcessor(),
  paypal: new PaypalPaymentProcessor(),
  cod: new CashOnDeliveryProcessor(),
});
const notificationService = new NotificationService();
const orderApplicationService = new OrderApplicationService({
  repository: orderRepository,
  paymentService,
  notificationService,
});

export default function App() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOrders(orderRepository.loadOrders());
  }, []);

  function buyNow() {
    try {
      const { orders: nextOrders, message } = orderApplicationService.placeOrder({
        user,
        item,
        qty,
        payment,
      });

      setOrders(nextOrders);
      setMessage(message);
    } catch (error) {
      setMessage(error.message || "Payment failed");
    }
  }

  function refund(orderId) {
    const { orders: nextOrders, message } = orderApplicationService.refundOrder(orderId);
    setOrders(nextOrders);
    setMessage(message);
  }

  function exportReport() {
    const { csv, revenue } = orderApplicationService.exportReport();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders_export.csv";
    a.click();

    setMessage(`Revenue: ${revenue}`);
  }

  return (
    <div className="page">
      <h1>Bad Commerce Admin</h1>
      <p>Intentionally bad architecture for SOLID refactoring exercise.</p>

      <div className="card">
        <h2>Create Order</h2>
        <label>User</label>
        <input value={user} onChange={(e) => setUser(e.target.value)} />

        <label>Item</label>
        <select value={item} onChange={(e) => setItem(e.target.value)}>
          <option value="laptop">laptop</option>
          <option value="phone">phone</option>
          <option value="headset">headset</option>
          <option value="misc">misc</option>
        </select>

        <label>Qty</label>
        <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />

        <label>Payment</label>
        <select value={payment} onChange={(e) => setPayment(e.target.value)}>
          <option value="card">card</option>
          <option value="paypal">paypal</option>
          <option value="cod">cod</option>
        </select>

        <button onClick={buyNow}>Buy</button>
        <button onClick={exportReport}>Export CSV + Revenue</button>
      </div>

      <div className="card">
        <h2>Orders</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.user}</td>
                <td>{o.item}</td>
                <td>{o.qty}</td>
                <td>{o.total}</td>
                <td>{o.status}</td>
                <td>
                  <button onClick={() => refund(o.id)}>Refund</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="message">{message}</p>
    </div>
  );
}
