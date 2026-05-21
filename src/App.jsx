import React, { useEffect, useState } from "react";

/*
========================================================
SOLID PRINCIPLES APPLIED
========================================================

1. S - Single Responsibility Principle (SRP)
--------------------------------------------------------
Before:
- App component handled:
  UI
  business logic
  payment
  pricing
  storage
  notifications
  reporting

After:
- Each class/function has ONE responsibility only.

Examples:
- PricingService -> only price calculation
- PaymentService -> only payment processing
- NotificationService -> only notifications
- StorageService -> only localStorage handling
- ReportService -> only CSV/report generation

WHY?
- Easier to maintain
- Easier to debug
- Easier to test


2. O - Open Closed Principle (OCP)
--------------------------------------------------------
Before:
- Adding new payment method required editing buyNow()

After:
- Payment methods are EXTENDABLE without modifying existing logic.

Example:
- Add new class:
    class UpiPayment {}

No need to modify existing code.

WHY?
- Safer scaling
- Less risk of breaking existing code


3. L - Liskov Substitution Principle (LSP)
--------------------------------------------------------
Applied in Payment classes.

All payment classes:
- CardPayment
- PaypalPayment
- CodPayment

can replace PaymentService safely because
they all implement:
    pay(amount)

WHY?
- Any payment implementation works interchangeably.


4. I - Interface Segregation Principle (ISP)
--------------------------------------------------------
Instead of one huge service doing everything,
we separated small focused APIs.

Example:
- NotificationService only handles notifications
- ReportService only handles reports

WHY?
- Components only depend on what they use.


5. D - Dependency Inversion Principle (DIP)
--------------------------------------------------------
Before:
- App directly depended on low-level logic.

After:
- App depends on abstractions/services.

Example:
- App uses:
    paymentProcessor.pay()

instead of direct gateway logic.

WHY?
- Loose coupling
- Easier mocking/testing
- Easier replacement of implementations

========================================================
*/


/* ========================================================
   PRODUCT PRICING SERVICE
   SRP:
   Only responsible for pricing calculation.
======================================================== */

class PricingService {
  static getItemPrice(item) {
    const prices = {
      laptop: 1000,
      phone: 500,
      headset: 50,
      misc: 20
    };

    return prices[item] || 20;
  }

  static calculateTotal(user, item, qty) {
    let total = this.getItemPrice(item) * qty;

    if (user === "vip") {
      total *= 0.7;
    } else if (qty > 10) {
      total *= 0.85;
    }

    return total;
  }
}


/* ========================================================
   PAYMENT SERVICES
   OCP + LSP

   New payment methods can be added
   WITHOUT modifying existing code.
======================================================== */

class CardPayment {
  pay(amount) {
    console.log(`Card payment success: ${amount}`);
    return true;
  }
}

class PaypalPayment {
  pay(amount) {
    console.log(`Paypal payment success: ${amount}`);
    return true;
  }
}

class CodPayment {
  pay(amount) {
    console.log(`Cash on delivery selected`);
    return true;
  }
}


/* ========================================================
   PAYMENT FACTORY
   DIP:
   UI depends on abstraction/factory,
   not concrete payment implementation.
======================================================== */

class PaymentFactory {
  static create(paymentType) {
    switch (paymentType) {
      case "card":
        return new CardPayment();

      case "paypal":
        return new PaypalPayment();

      case "cod":
        return new CodPayment();

      default:
        return null;
    }
  }
}


/* ========================================================
   STORAGE SERVICE
   SRP:
   Only handles localStorage operations.
======================================================== */

class StorageService {
  static loadOrders() {
    const stored = localStorage.getItem("orders");
    return stored ? JSON.parse(stored) : [];
  }

  static saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
  }
}


/* ========================================================
   NOTIFICATION SERVICE
   SRP + ISP

   Handles:
   - email
   - sms

   Nothing else.
======================================================== */

class NotificationService {
  static sendEmail(order) {
    fetch("https://httpbin.org/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: `${order.user}@mail.com`,
        text: `Order ${order.id} confirmed`
      })
    }).catch(() => {});
  }

  static sendSMS(order) {
    alert(`SMS to ${order.user}: Order ${order.id} placed`);
  }
}


/* ========================================================
   REPORT SERVICE
   SRP:
   Only responsible for CSV/report generation.
======================================================== */

class ReportService {
  static exportOrders(orders) {
    let revenue = 0;

    const lines = ["id,user,item,qty,total,status"];

    orders.forEach((o) => {
      if (o.status !== "REFUNDED") {
        revenue += o.total;
      }

      lines.push(
        `${o.id},${o.user},${o.item},${o.qty},${o.total},${o.status}`
      );
    });

    const blob = new Blob([lines.join("\n")], {
      type: "text/csv"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "orders_export.csv";
    a.click();

    return revenue;
  }
}


/* ========================================================
   MAIN UI COMPONENT
   NOW CLEANER

   ONLY handles:
   - state
   - rendering
   - calling services

   SRP applied.
======================================================== */

export default function App() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");


  /* ====================================================
     Load orders from storage
  ==================================================== */

  useEffect(() => {
    setOrders(StorageService.loadOrders());
  }, []);


  /* ====================================================
     Save orders automatically
  ==================================================== */

  useEffect(() => {
    StorageService.saveOrders(orders);
  }, [orders]);


  /* ====================================================
     BUY ORDER
     Now uses services instead of inline logic.
  ==================================================== */

  function buyNow() {

    // Pricing handled separately (SRP)
    const total = PricingService.calculateTotal(
      user,
      item,
      Number(qty)
    );


    // Payment handling abstracted (DIP + OCP)
    const paymentProcessor =
      PaymentFactory.create(payment);

    if (!paymentProcessor) {
      setMessage("Payment failed");
      return;
    }

    paymentProcessor.pay(total);


    // Order object creation
    const newOrder = {
      id: Date.now(),
      user,
      item,
      qty: Number(qty),
      total,
      status: "PLACED"
    };


    // Update state
    setOrders((prev) => [...prev, newOrder]);


    // Notifications separated (SRP)
    NotificationService.sendEmail(newOrder);
    NotificationService.sendSMS(newOrder);


    setMessage(
      `Order ${newOrder.id} placed. Total: ${total}`
    );
  }


  /* ====================================================
     REFUND LOGIC
     Could later move to OrderService if scaling.
  ==================================================== */

  function refund(orderId) {
    const updated = orders.map((o) => {
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

    setOrders(updated);

    setMessage(
      `Refund attempted for ${orderId}`
    );
  }


  /* ====================================================
     EXPORT REPORT
     Delegated to ReportService (SRP)
  ==================================================== */

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
          <option value="laptop">
            laptop
          </option>

          <option value="phone">
            phone
          </option>

          <option value="headset">
            headset
          </option>

          <option value="misc">
            misc
          </option>
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
          <option value="card">
            card
          </option>

          <option value="paypal">
            paypal
          </option>

          <option value="cod">
            cod
          </option>
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
