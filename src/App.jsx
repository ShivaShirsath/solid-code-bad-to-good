import React, { useEffect, useState } from "react";

// INTENTIONALLY BAD: massive component with UI + business logic + infra + reports + notifications + storage.
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
    let price = 20;
    if (item === "laptop") price = 1000;
    else if (item === "phone") price = 500;
    else if (item === "headset") price = 50;

    let total = price * Number(qty);
    if (user === "vip") total *= 0.7;
    else if (Number(qty) > 10) total *= 0.85;

    if (payment === "card") {
      console.log("Calling card gateway directly [v2]");
    } else if (payment === "paypal") {
      console.log("Calling paypal API directly");
    } else if (payment === "cod") {
      console.log("Cash on delivery");
    } else {
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
    fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: `${user}@mail.com`, text: `Order ${newOrder.id} confirmed` })
    }).catch(() => {});

    alert(`SMS to ${user}: Order ${newOrder.id} placed`);

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
    let revenue = 0;
    const lines = ["id,user,item,qty,total,status"];

    orders.forEach((o) => {
      if (o.status !== "REFUNDED") revenue += o.total;
      lines.push(`${o.id},${o.user},${o.item},${o.qty},${o.total},${o.status}`);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
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
