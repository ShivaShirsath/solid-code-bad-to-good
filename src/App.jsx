import React, { useEffect, useState } from "react";
import { processPayment } from "./services/payment";
import { calculateTotal } from "./services/order";
import OrderForm from "./orders/OrderForm";
import OrdersTable from "./orders/OrderTable";

function sendConfirmation(order) {
  fetch("https://httpbin.org/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: `${order.user}@mail.com`,
      text: `Order ${order.id} confirmed`
    })
  }).catch(() => { });

  alert(`SMS to ${order.user}: Order ${order.id} placed`);
}

function createCsv(orders) {
  const lines = ["id,user,item,qty,total,status"];

  orders.forEach((order) => {
    lines.push(`${order.id},${order.user},${order.item},${order.qty},${order.total},${order.status}`);
  });

  return lines.join("\n");
}

function calculateRevenue(orders) {
  let revenue = 0;

  orders.forEach((order) => {
    if (order.status !== "REFUNDED") revenue += order.total;
  });

  return revenue;
}

function downloadCsv(csv) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "orders_export.csv";
  a.click();
}



export default function App() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("orders");
    if (stored) setOrders(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  function buyNow() {
    const orderQty = Number(qty);
    const total = calculateTotal(item, orderQty, user);

    if (!processPayment(payment)) {
      setMessage("Payment failed");
      return;
    }

    const newOrder = {
      id: Date.now(),
      user,
      item,
      qty: orderQty,
      total,
      status: "PLACED"
    };

    setOrders([...orders, newOrder]);
    sendConfirmation(newOrder);
    setMessage(`Order ${newOrder.id} placed. Total: ${total}`);
  }

  function refund(orderId) {
    const next = orders.map((order) => {
      if (order.id === orderId && order.status !== "REFUNDED") {
        return { ...order, status: "REFUNDED" };
      }

      return order;
    });

    setOrders(next);
    setMessage(`Refund attempted for ${orderId}`);
  }

  function exportReport() {
    downloadCsv(createCsv(orders));
    setMessage(`Revenue: ${calculateRevenue(orders)}`);
  }

  return (
    <div className="page">
      <h1>Bad Commerce Admin</h1>
      <p>Intentionally bad architecture for SOLID refactoring exercise.</p>

      <OrderForm
        user={user}
        item={item}
        qty={qty}
        payment={payment}
        onUserChange={setUser}
        onItemChange={setItem}
        onQtyChange={setQty}
        onPaymentChange={setPayment}
        onBuy={buyNow}
        onExport={exportReport}
      />

      <OrdersTable orders={orders} onRefund={refund} />

      <p className="message">{message}</p>
    </div>
  );
}
