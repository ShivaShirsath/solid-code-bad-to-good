
import React, { useEffect, useState } from "react";
import { CATALOG } from "./catalog";
import { calculatePrice } from "./pricingService";
import { createOrder, refundOrder } from "./orderService";
import { loadOrders, saveOrders } from "./storageService";
import { notifyUser, sendEmail } from "./notificationService";
import { processPayment } from "./paymentService";

export default function App() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);


  function buyNow() {
    const total = calculatePrice(item, qty, user);
    const paymentResult = processPayment(payment);
    if (!paymentResult.success) {
      setMessage(paymentResult.message);
      return;
    }
    const newOrder = createOrder({ user, item, qty, total });
    setOrders([...orders, newOrder]);
    sendEmail(user, newOrder.id);
    notifyUser(user, newOrder.id);
    setMessage(`Order ${newOrder.id} placed. Total: ${total}`);
  }


  function refund(orderId) {
    const next = refundOrder(orders, orderId);
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
      <h1>Commerce Admin</h1>
      <p>Refactored for SOLID principles.</p>

      <div className="card">
        <h2>Create Order</h2>
        <label>User</label>
        <input value={user} onChange={(e) => setUser(e.target.value)} />

        <label>Item</label>
        <select value={item} onChange={(e) => setItem(e.target.value)}>
          {Object.entries(CATALOG).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
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

//----------------------------------------------------------------------------------------------
// import { useState, useEffect, useCallback } from "react";

// // ─────────────────────────────────────────────
// // 1. CATALOG  (Single Source of Truth for prices)
// // ─────────────────────────────────────────────
// const CATALOG = {
//   laptop:  { label: "Laptop",  price: 1000 },
//   phone:   { label: "Phone",   price: 500  },
//   headset: { label: "Headset", price: 50   },
//   misc:    { label: "Misc",    price: 20   },
// };

// // ─────────────────────────────────────────────
// // 2. PRICING SERVICE  (Single Responsibility)
// //    Only knows how to compute totals. Nothing else.
// // ─────────────────────────────────────────────
// const PricingService = {
//   getBasePrice(itemKey) {
//     return CATALOG[itemKey]?.price ?? 0;
//   },

//   applyDiscounts(subtotal, { userType, qty }) {
//     if (userType === "vip")    return subtotal * 0.70;
//     if (qty > 10)              return subtotal * 0.85;
//     return subtotal;
//   },

//   calculate({ itemKey, qty, userType }) {
//     const base     = this.getBasePrice(itemKey);
//     const subtotal = base * qty;
//     return this.applyDiscounts(subtotal, { userType, qty });
//   },
// };

// // ─────────────────────────────────────────────
// // 3. PAYMENT GATEWAY  (Open/Closed + Dependency Inversion)
// //    Add new payment methods without touching existing code.
// // ─────────────────────────────────────────────
// const PaymentGateway = (() => {
//   const handlers = {
//     card:   (order) => { console.log("[Gateway] Card charge:", order.total);   return true; },
//     paypal: (order) => { console.log("[Gateway] PayPal charge:", order.total); return true; },
//     cod:    (order) => { console.log("[Gateway] COD registered:", order.id);   return true; },
//   };

//   return {
//     process(method, order) {
//       const handler = handlers[method];
//       if (!handler) throw new Error(`Unknown payment method: ${method}`);
//       return handler(order);
//     },
//     getMethods: () => Object.keys(handlers),
//   };
// })();

// // ─────────────────────────────────────────────
// // 4. ORDER REPOSITORY  (Single Responsibility — persistence only)
// //    Swappable: change to API calls without touching UI.
// // ─────────────────────────────────────────────
// const OrderRepository = {
//   STORAGE_KEY: "orders_v2",

//   load() {
//     try {
//       return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) ?? [];
//     } catch {
//       return [];
//     }
//   },

//   save(orders) {
//     localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
//   },

//   create(orderData) {
//     return { ...orderData, id: Date.now(), status: "PLACED" };
//   },

//   markRefunded(orders, orderId) {
//     return orders.map((o) =>
//       o.id === orderId && o.status !== "REFUNDED"
//         ? { ...o, status: "REFUNDED" }
//         : o
//     );
//   },
// };

// // ─────────────────────────────────────────────
// // 5. NOTIFICATION SERVICE  (Single Responsibility)
// //    Decoupled from UI and order logic.
// // ─────────────────────────────────────────────
// const NotificationService = {
//   async sendEmail(to, subject, body) {
//     try {
//       await fetch("https://httpbin.org/post", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ to, subject, body }),
//       });
//     } catch {
//       console.warn("[Notifications] Email delivery failed (non-critical)");
//     }
//   },

//   sendSMS(user, message) {
//     // In production: real SMS API call
//     console.log(`[SMS → ${user}] ${message}`);
//   },

//   async notifyOrderPlaced(order) {
//     this.sendSMS(order.user, `Order #${order.id} confirmed. Total: $${order.total.toFixed(2)}`);
//     await this.sendEmail(
//       `${order.user}@mail.com`,
//       `Order #${order.id} confirmed`,
//       `Your order for ${order.qty}x ${order.item} has been placed.`
//     );
//   },
// };

// // ─────────────────────────────────────────────
// // 6. REPORT SERVICE  (Single Responsibility)
// //    Knows nothing about UI or storage internals.
// // ─────────────────────────────────────────────
// const ReportService = {
//   buildCSV(orders) {
//     const header = "id,user,item,qty,total,status";
//     const rows   = orders.map(
//       (o) => `${o.id},${o.user},${o.item},${o.qty},${o.total.toFixed(2)},${o.status}`
//     );
//     return [header, ...rows].join("\n");
//   },

//   calcRevenue(orders) {
//     return orders
//       .filter((o) => o.status !== "REFUNDED")
//       .reduce((sum, o) => sum + o.total, 0);
//   },

//   downloadCSV(orders) {
//     const csv  = this.buildCSV(orders);
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url  = URL.createObjectURL(blob);
//     const a    = Object.assign(document.createElement("a"), {
//       href: url, download: "orders_export.csv",
//     });
//     a.click();
//     URL.revokeObjectURL(url);
//     return this.calcRevenue(orders);
//   },
// };

// // ─────────────────────────────────────────────
// // 7. useOrders HOOK  (custom hook = thin orchestration layer)
// //    Coordinates services; keeps UI components pure & dumb.
// // ─────────────────────────────────────────────
// function useOrders() {
//   const [orders,  setOrders]  = useState(() => OrderRepository.load());
//   const [message, setMessage] = useState("");

//   // Persist on every change
//   useEffect(() => { OrderRepository.save(orders); }, [orders]);

//   const placeOrder = useCallback(async ({ user, item, qty, payment }) => {
//     const total    = PricingService.calculate({ itemKey: item, qty: Number(qty), userType: user });
//     const newOrder = OrderRepository.create({ user, item, qty: Number(qty), total, payment });

//     PaymentGateway.process(payment, newOrder); // throws if method invalid

//     setOrders((prev) => [...prev, newOrder]);
//     setMessage(`✓ Order #${newOrder.id} placed — $${total.toFixed(2)}`);
//     NotificationService.notifyOrderPlaced(newOrder); // fire-and-forget
//   }, []);

//   const refundOrder = useCallback((orderId) => {
//     setOrders((prev) => {
//       const next = OrderRepository.markRefunded(prev, orderId);
//       return next;
//     });
//     setMessage(`↩ Refund processed for order #${orderId}`);
//   }, []);

//   const exportReport = useCallback(() => {
//     const revenue = ReportService.downloadCSV(orders);
//     setMessage(`📊 CSV exported — Net revenue: $${revenue.toFixed(2)}`);
//   }, [orders]);

//   return { orders, message, placeOrder, refundOrder, exportReport };
// }

// // ─────────────────────────────────────────────
// // 8. UI COMPONENTS  (pure presentational, no business logic)
// // ─────────────────────────────────────────────

// function OrderForm({ onSubmit }) {
//   const [form, setForm] = useState({
//     user: "vip", item: "laptop", qty: 1, payment: "card",
//   });
//   const [error, setError] = useState("");

//   const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

//   function handleSubmit() {
//     if (!form.user.trim()) { setError("User is required"); return; }
//     if (form.qty < 1)      { setError("Qty must be ≥ 1"); return; }
//     setError("");
//     try { onSubmit(form); } catch (err) { setError(err.message); }
//   }

//   return (
//     <section className="card">
//       <h2>New Order</h2>
//       <div className="form-grid">
//         <div className="field">
//           <label>User</label>
//           <input value={form.user} onChange={set("user")} placeholder="username or 'vip'" />
//         </div>
//         <div className="field">
//           <label>Item</label>
//           <select value={form.item} onChange={set("item")}>
//             {Object.entries(CATALOG).map(([key, { label, price }]) => (
//               <option key={key} value={key}>{label} — ${price}</option>
//             ))}
//           </select>
//         </div>
//         <div className="field">
//           <label>Qty</label>
//           <input type="number" min={1} value={form.qty} onChange={set("qty")} />
//         </div>
//         <div className="field">
//           <label>Payment</label>
//           <select value={form.payment} onChange={set("payment")}>
//             {PaymentGateway.getMethods().map((m) => (
//               <option key={m} value={m}>{m.toUpperCase()}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Live price preview — uses PricingService directly, zero coupling to order state */}
//       <p className="price-preview">
//         Estimated total:{" "}
//         <strong>
//           ${PricingService.calculate({
//             itemKey: form.item, qty: Number(form.qty), userType: form.user,
//           }).toFixed(2)}
//         </strong>
//         {form.user === "vip" && <span className="badge vip">VIP 30% off</span>}
//         {form.user !== "vip" && Number(form.qty) > 10 && <span className="badge bulk">Bulk 15% off</span>}
//       </p>

//       {error && <p className="error">{error}</p>}
//       <button className="btn-primary" onClick={handleSubmit}>Place Order</button>
//     </section>
//   );
// }

// function OrderTable({ orders, onRefund, onExport }) {
//   if (orders.length === 0)
//     return (
//       <section className="card empty">
//         <h2>Orders</h2>
//         <p className="muted">No orders yet.</p>
//       </section>
//     );

//   return (
//     <section className="card">
//       <div className="table-header">
//         <h2>Orders <span className="count">{orders.length}</span></h2>
//         <button className="btn-secondary" onClick={onExport}>Export CSV</button>
//       </div>
//       <div className="table-wrap">
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th><th>User</th><th>Item</th>
//               <th>Qty</th><th>Total</th><th>Method</th><th>Status</th><th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((o) => (
//               <tr key={o.id} className={o.status === "REFUNDED" ? "refunded" : ""}>
//                 <td className="mono">#{o.id}</td>
//                 <td>{o.user}</td>
//                 <td>{CATALOG[o.item]?.label ?? o.item}</td>
//                 <td>{o.qty}</td>
//                 <td className="mono">${o.total.toFixed(2)}</td>
//                 <td><span className="tag">{o.payment?.toUpperCase() ?? "—"}</span></td>
//                 <td>
//                   <span className={`status ${o.status.toLowerCase()}`}>{o.status}</span>
//                 </td>
//                 <td>
//                   {o.status !== "REFUNDED" && (
//                     <button className="btn-ghost" onClick={() => onRefund(o.id)}>Refund</button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }

// function Toast({ message }) {
//   return message ? <div className="toast">{message}</div> : null;
// }

// // ─────────────────────────────────────────────
// // 9. APP ROOT  (thin coordinator — just wires hook → components)
// // ─────────────────────────────────────────────
// export default function App() {
//   const { orders, message, placeOrder, refundOrder, exportReport } = useOrders();

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,300;9..144,600&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         :root {
//           --bg:       #0f0f11;
//           --surface:  #18181c;
//           --border:   #2a2a32;
//           --accent:   #c8f55a;
//           --accent2:  #5af5c8;
//           --text:     #e8e8ee;
//           --muted:    #6b6b7a;
//           --danger:   #f55a6e;
//           --radius:   12px;
//           --mono: 'DM Mono', monospace;
//           --serif: 'Fraunces', serif;
//         }

//         body { background: var(--bg); color: var(--text); font-family: var(--mono); min-height: 100vh; }

//         .app { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }

//         header { margin-bottom: 2.5rem; }
//         header h1 { font-family: var(--serif); font-size: 2.4rem; font-weight: 300; color: var(--accent); letter-spacing: -0.02em; }
//         header p  { color: var(--muted); font-size: .8rem; margin-top: .4rem; }

//         .card {
//           background: var(--surface);
//           border: 1px solid var(--border);
//           border-radius: var(--radius);
//           padding: 1.75rem;
//           margin-bottom: 1.5rem;
//         }

//         h2 {
//           font-family: var(--serif);
//           font-size: 1.15rem;
//           font-weight: 300;
//           color: var(--accent2);
//           margin-bottom: 1.25rem;
//           letter-spacing: .02em;
//         }

//         .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

//         .field { display: flex; flex-direction: column; gap: .4rem; }
//         label  { font-size: .72rem; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }

//         input, select {
//           background: var(--bg);
//           border: 1px solid var(--border);
//           border-radius: 8px;
//           color: var(--text);
//           font-family: var(--mono);
//           font-size: .85rem;
//           padding: .55rem .75rem;
//           outline: none;
//           transition: border-color .15s;
//         }
//         input:focus, select:focus { border-color: var(--accent); }

//         .price-preview {
//           margin: 1.25rem 0 1rem;
//           font-size: .9rem;
//           color: var(--muted);
//         }
//         .price-preview strong { color: var(--accent); font-size: 1.05rem; }

//         .badge {
//           display: inline-block;
//           font-size: .68rem;
//           padding: .15rem .5rem;
//           border-radius: 99px;
//           margin-left: .6rem;
//           vertical-align: middle;
//         }
//         .badge.vip  { background: #c8f55a22; color: var(--accent); border: 1px solid var(--accent); }
//         .badge.bulk { background: #5af5c822; color: var(--accent2); border: 1px solid var(--accent2); }

//         .error { color: var(--danger); font-size: .8rem; margin-bottom: .75rem; }

//         .btn-primary {
//           background: var(--accent);
//           color: #0f0f11;
//           border: none;
//           border-radius: 8px;
//           padding: .65rem 1.5rem;
//           font-family: var(--mono);
//           font-size: .85rem;
//           font-weight: 500;
//           cursor: pointer;
//           transition: opacity .15s, transform .1s;
//         }
//         .btn-primary:hover { opacity: .88; transform: translateY(-1px); }

//         .btn-secondary {
//           background: transparent;
//           color: var(--accent2);
//           border: 1px solid var(--accent2);
//           border-radius: 8px;
//           padding: .45rem 1rem;
//           font-family: var(--mono);
//           font-size: .78rem;
//           cursor: pointer;
//           transition: background .15s;
//         }
//         .btn-secondary:hover { background: #5af5c811; }

//         .btn-ghost {
//           background: transparent;
//           color: var(--danger);
//           border: 1px solid transparent;
//           border-radius: 6px;
//           padding: .3rem .6rem;
//           font-family: var(--mono);
//           font-size: .75rem;
//           cursor: pointer;
//         }
//         .btn-ghost:hover { border-color: var(--danger); }

//         .table-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
//         .table-header h2 { margin-bottom: 0; }
//         .count { display: inline-flex; align-items: center; justify-content: center; background: var(--border); border-radius: 99px; font-size: .7rem; padding: .1rem .5rem; margin-left: .5rem; color: var(--muted); }

//         .table-wrap { overflow-x: auto; }

//         table { width: 100%; border-collapse: collapse; font-size: .8rem; }
//         th { text-align: left; color: var(--muted); font-weight: 400; font-size: .7rem; text-transform: uppercase; letter-spacing: .06em; padding: .5rem .75rem; border-bottom: 1px solid var(--border); }
//         td { padding: .65rem .75rem; border-bottom: 1px solid #1e1e24; vertical-align: middle; }
//         tr:last-child td { border-bottom: none; }
//         tr.refunded td { opacity: .45; }

//         .mono { font-family: var(--mono); }

//         .tag {
//           background: var(--border);
//           border-radius: 4px;
//           padding: .1rem .4rem;
//           font-size: .7rem;
//           color: var(--muted);
//         }

//         .status { font-size: .72rem; padding: .15rem .55rem; border-radius: 99px; font-weight: 500; text-transform: uppercase; letter-spacing: .05em; }
//         .status.placed   { background: #5af5c822; color: var(--accent2); }
//         .status.refunded { background: #f55a6e22; color: var(--danger); }

//         .empty { text-align: center; padding: 3rem; }
//         .muted { color: var(--muted); font-size: .85rem; }

//         .toast {
//           position: fixed;
//           bottom: 2rem;
//           left: 50%;
//           transform: translateX(-50%);
//           background: var(--surface);
//           border: 1px solid var(--border);
//           border-left: 3px solid var(--accent);
//           border-radius: 8px;
//           padding: .75rem 1.25rem;
//           font-size: .82rem;
//           color: var(--text);
//           white-space: nowrap;
//           box-shadow: 0 8px 32px #00000066;
//           animation: slideUp .25s ease;
//           z-index: 100;
//         }
//         @keyframes slideUp {
//           from { opacity: 0; transform: translate(-50%, 12px); }
//           to   { opacity: 1; transform: translate(-50%, 0); }
//         }

//         @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
//       `}</style>

//       <div className="app">
//         <header>
//           <h1>Commerce Admin</h1>
//           <p>Refactored · SOLID architecture · Services decoupled from UI</p>
//         </header>

//         <OrderForm onSubmit={placeOrder} />
//         <OrderTable orders={orders} onRefund={refundOrder} onExport={exportReport} />
//         <Toast message={message} />
//       </div>
//     </>
//   );
// }
