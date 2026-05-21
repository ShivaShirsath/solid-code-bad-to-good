import React, { useEffect, useState } from "react";

import PricingService from "../services/PricingService";
import PaymentFactory from "../services/PaymentService";
import StorageService from "../services/StorageService";
import NotificationService from "../services/NotificationService";
import ReportService from "../services/ReportService";

/*
========================================================
APP COMPONENT
========================================================

SOLID PRINCIPLE USED:
---------------------
1. SRP (Single Responsibility Principle)

Before:
- App handled EVERYTHING:
  UI
  business logic
  payments
  storage
  notifications
  reports

After:
- App only handles:
  - UI
  - state management
  - calling services

WHY?
- Cleaner component
- Easier maintenance
- Easier testing
========================================================
*/

export default function App() {

  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");


  /*
  ========================================================
  LOAD ORDERS

  Storage logic moved to StorageService.

  SOLID:
  SRP
  ========================================================
  */

  useEffect(() => {
    setOrders(StorageService.loadOrders());
  }, []);


  /*
  ========================================================
  SAVE ORDERS

  Storage handling separated from UI.

  SOLID:
  SRP
  ========================================================
  */

  useEffect(() => {
    StorageService.saveOrders(orders);
  }, [orders]);


  /*
  ========================================================
  BUY ORDER

  Business logic moved into services.

  SOLID USED:
  -------------
  1. SRP
  2. OCP
  3. DIP

  HOW?
  ----
  - PricingService handles pricing.
  - PaymentFactory handles payment selection.
  - NotificationService handles notifications.

  WHY?
  ----
  - UI stays clean.
  - Easy to add new features.
  ========================================================
  */

  function buyNow() {

    // Pricing handled separately
    const total =
      PricingService.calculateTotal(
        user,
        item,
        Number(qty)
      );


    /*
    ====================================================
    PAYMENT FACTORY

    DIP + OCP

    App does NOT directly depend on:
    - Card payment
    - Paypal payment
    - COD payment

    Instead:
    - App depends on abstraction/factory.

    WHY?
    ----
    Adding new payment methods becomes easy.
    ====================================================
    */

    const paymentProcessor =
      PaymentFactory.create(payment);

    if (!paymentProcessor) {
      setMessage("Payment failed");
      return;
    }

    paymentProcessor.pay(total);


    // Order object
    const newOrder = {
      id: Date.now(),
      user,
      item,
      qty: Number(qty),
      total,
      status: "PLACED"
    };


    // Update orders
    setOrders((prev) => [...prev, newOrder]);


    /*
    ====================================================
    NOTIFICATIONS

    Notification logic separated.

    SOLID:
    SRP + ISP
    ====================================================
    */

    NotificationService.sendEmail(newOrder);
    NotificationService.sendSMS(newOrder);


    setMessage(
      `Order ${newOrder.id} placed. Total: ${total}`
    );
  }


  /*
  ========================================================
  REFUND ORDER

  Only updates order state.

  Could later move into OrderService if project grows.
  ========================================================
  */

  function refund(orderId) {

    const updatedOrders = orders.map((o) => {

      if (
        o.id === orderId &&
        o.status !== "REFUNDED"
      ) {
        return {
          ...o,
          status: "REFUNDED"
        };
      }

      return o;
    });

    setOrders(updatedOrders);

    setMessage(
      `Refund attempted for ${orderId}`
    );
  }


  /*
  ========================================================
  EXPORT REPORT

  Report generation moved outside component.

  SOLID:
  SRP
  ========================================================
  */

  function exportReport() {

    const revenue =
      ReportService.exportOrders(orders);

    setMessage(`Revenue: ${revenue}`);
  }


  return (
    <div className="page">

      <h1>SOLID Commerce Admin</h1>

      <p>
        Refactored using SOLID Principles
      </p>


      <div className="card">

        <h2>Create Order</h2>

        <label>User</label>

        <input
          value={user}
          onChange={(e) =>
            setUser(e.target.value)
          }
        />


        <label>Item</label>

        <select
          value={item}
          onChange={(e) =>
            setItem(e.target.value)
          }
        >
          <option value="laptop">laptop</option>
          <option value="phone">phone</option>
          <option value="headset">headset</option>
          <option value="misc">misc</option>
        </select>


        <label>Qty</label>

        <input
          type="number"
          value={qty}
          onChange={(e) =>
            setQty(e.target.value)
          }
        />


        <label>Payment</label>

        <select
          value={payment}
          onChange={(e) =>
            setPayment(e.target.value)
          }
        >
          <option value="card">card</option>
          <option value="paypal">paypal</option>
          <option value="cod">cod</option>
        </select>


        <button onClick={buyNow}>
          Buy
        </button>

        <button onClick={exportReport}>
          Export CSV + Revenue
        </button>

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
                  <button
                    onClick={() =>
                      refund(o.id)
                    }
                  >
                    Refund
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      <p className="message">
        {message}
      </p>

    </div>
  );
}