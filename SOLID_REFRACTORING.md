# SOLID Refactor — Detailed Trace

This document explains exactly what changed during the refactor, why it changed (SOLID mapping), and shows small before/after code snippets so you can follow along.

Goal: separate responsibilities and move business logic and side effects out of the UI component so each part has a single reason to change.

Files added/modified (short):

- [src/App.jsx](src/App.jsx)
- [src/services/storageService.js](src/services/storageService.js)
- [src/services/paymentService.js](src/services/paymentService.js)
- [src/services/notificationService.js](src/services/notificationService.js)
- [src/services/reportService.js](src/services/reportService.js)
- [src/services/orderService.js](src/services/orderService.js)

------------------------------------------------------------
- **Goal:** move business rules, side-effects, and infra out of the UI so the component only handles rendering and user interactions.

- **High-level changes**:
  - `src/App.jsx`: component simplified — now only UI and control flow. It delegates business logic and side-effects to services.
  - `src/services/storageService.js`: storage abstraction for localStorage (Dependency Inversion).
  - `src/services/paymentService.js`: payment strategy container; add new payment methods without touching callers (Open/Closed).
  - `src/services/notificationService.js`: centralized notifications (Single Responsibility).
  - `src/services/reportService.js`: CSV export and revenue calculation (Single Responsibility).
  - `src/services/orderService.js`: encapsulates order creation, pricing and refund rules; depends on injected services (SRP + DI).

S (Single Responsibility) (Single Job): Every part of your code should do exactly one job.
O (Open/Closed) (Add, Don't Change): You should add new features without breaking old code.
L (Liskov Substitution) (Perfect Swaps): A child object must do everything its parent object promised to do.
I (Interface Segregation) (No Useless Buttons): Do not force code to use tools or features it does not need.
D (Dependency Inversion) (Use a Middleman): Main logic should connect to general rules, not specific tools.

- **SOLID mapping**:
  - **S (Single Responsibility):** Each service has one reason to change: storage, payments, notifications, reports, orders.
  - **O (Open/Closed):** Payment methods and notification implementations can be extended by adding new strategies or services.
  - **L (Liskov Substitution):** Services are replaceable with compatible implementations (e.g., a different storage implementation).
  - **I (Interface Segregation):** UI consumes small focused service APIs instead of a monolithic API.
  - **D (Dependency Inversion):** `OrderService` depends on abstracted services injected at construction.

- **How the refactor helps**:
  - Easier to test business logic (`OrderService`) without the UI.
  - Side-effects (network, alerts) live in one place and can be mocked or swapped.
  - Adding a new payment method is a matter of adding a function to `PaymentService` strategies.


  ------------------------------------------------------------------------------------------------

1) `src/App.jsx`

What was wrong (original): UI contained business logic, storage access, payment branching, network calls and alerts — everything in one place.

Bad snippet (original `buyNow`):
```js
// inside App component
function buyNow() {
  // choose price, compute total, apply discounts
  if (payment === 'card') { console.log('Calling card gateway directly') }
  // create order and push to state
  setOrders([...orders, newOrder]);
  // perform side-effects (network + alert) directly
  fetch('https://httpbin.org/post', ...)
  alert(`SMS to ${user}: Order ${newOrder.id} placed`)
}
```

Refactored snippet (delegates to services):
```js
// App.jsx (UI only)
function buyNow() {
  const result = orderService.createOrder({ user, item, qty, paymentMethod });
  if (!result.success) { setMessage('Payment failed'); return }
  setOrders(orderService.getAll());
  setMessage(`Order ${result.order.id} placed. Total: ${result.order.total}`);
}
```

Reason and SOLID mapping:
- Single Responsibility: `App` now only manages UI and user interactions.
- Dependency Inversion: `App` uses `orderService` which hides infra details.
- Benefit: Easier to test UI and business logic separately.

------------------------------------------------------------

2) `src/services/storageService.js`

What was wrong: `App` read and wrote `localStorage` directly with `useEffect`, coupling UI to storage format and API.

Bad snippet (original useEffect):
```js
useEffect(() => {
  const stored = localStorage.getItem('orders')
  if (stored) setOrders(JSON.parse(stored))
}, [])

useEffect(() => {
  localStorage.setItem('orders', JSON.stringify(orders))
}, [orders])
```

Refactored snippet (new `StorageService`):
```js
export default class StorageService {
  constructor(namespace = 'orders') { this.namespace = namespace }
  getAll() { const s = localStorage.getItem(this.namespace); return s ? JSON.parse(s) : [] }
  saveAll(items) { localStorage.setItem(this.namespace, JSON.stringify(items)) }
}
```

Reason and SOLID mapping:
- Dependency Inversion: high-level `OrderService` depends on the `StorageService` abstraction rather than localStorage directly.
- Single Responsibility: storage concerns are isolated.

------------------------------------------------------------

3) `src/services/paymentService.js`

What was wrong: `App` used conditionals to handle different payment methods, so adding a new method required editing UI logic.

Bad snippet (original):
```js
if (payment === 'card') console.log('Calling card gateway directly')
else if (payment === 'paypal') console.log('Calling paypal API directly')
else if (payment === 'cod') console.log('Cash on delivery')
else setMessage('Payment failed')
```

Refactored snippet (strategy container):
```js
export default class PaymentService {
  constructor(strategies = {}) { this.strategies = strategies }
  process(method, payload) {
    const fn = this.strategies[method];
    if (!fn) return false
    return fn(payload)
  }
}
```

Usage example (pluggable strategies):
```js
const payment = new PaymentService({
  card: ({total}) => { console.log('card', total); return true },
  paypal: ({total}) => { console.log('paypal', total); return true }
})
```

Reason and SOLID mapping:
- Open/Closed: add new payment methods by registering a new strategy instead of modifying code paths.
- Single Responsibility: payment-specific code is located in one place.

------------------------------------------------------------

4) `src/services/notificationService.js`

What was wrong: network requests and user alerts were scattered inside the UI, making it hard to mock or swap notification mechanisms.

Bad snippet (original in App):
```js
fetch('https://httpbin.org/post', { method: 'POST', ... })
alert(`SMS to ${user}: Order ${newOrder.id} placed`)
```

Refactored snippet:
```js
export default class NotificationService {
  async sendEmail(to, text) { await fetch('https://httpbin.org/post', { method:'POST', body: JSON.stringify({to,text}) }) }
  sendSMS(user, text) { alert(`SMS to ${user}: ${text}`) }
}
```

Reason and SOLID mapping:
- Single Responsibility: notifications are encapsulated.
- Open/Closed: swap `sendEmail` implementation for a real API without changing callers.

------------------------------------------------------------

5) `src/services/reportService.js`

What was wrong: CSV export and revenue calculation lived inside the UI component.

Bad snippet (original `exportReport`):
```js
let revenue = 0; const lines = ['id,user,item,qty,total,status'];
orders.forEach(o => { if (o.status !== 'REFUNDED') revenue += o.total; lines.push(...)} )
const blob = new Blob([lines.join('\n')], { type: 'text/csv' }); // DOM code
```

Refactored snippet:
```js
export default class ReportService {
  exportCSV(orders) { /* build lines, create blob, click link */ }
  revenue(orders) { return orders.reduce((acc,o) => o.status !== 'REFUNDED' ? acc + o.total : acc, 0) }
}
```

Reason and SOLID mapping:
- Single Responsibility: report generation separated from UI and order logic.

------------------------------------------------------------

6) `src/services/orderService.js`

What was wrong: `App` implemented pricing, discount rules, payment processing, storage and notifications inline — mixing multiple responsibilities.

Bad snippet (original):
```js
// many responsibilities mixed: price, discount, payment, state mutation, side-effects
let price = 20; if (item === 'laptop') price = 1000; let total = price * qty; if (user === 'vip') total *= 0.7; // ...
setOrders([...orders, newOrder]); fetch(...); alert(...)
```

Refactored snippet (new `OrderService`):
```js
export default class OrderService {
  constructor({ storage, payment, notification }) { this.storage = storage; this.payment = payment; this.notification = notification }
  _priceForItem(item) { /* pricing */ }
  _applyDiscount(total, user, qty) { /* promo rules */ }
  getAll() { return this.storage.getAll() }
  createOrder({ user, item, qty, paymentMethod }) {
    const price = this._priceForItem(item)
    let total = price * Number(qty)
    total = this._applyDiscount(total, user, qty)
    const paid = this.payment.process(paymentMethod, { total, user })
    if (!paid) return { success: false, reason: 'payment_failed' }
    const newOrder = { id: Date.now(), user, item, qty: Number(qty), total, status: 'PLACED' }
    const next = [...this.getAll(), newOrder]
    this.storage.saveAll(next)
    this.notification.sendEmail(`${user}@mail.com`, `Order ${newOrder.id} confirmed`)
    this.notification.sendSMS(user, `Order ${newOrder.id} placed`)
    return { success: true, order: newOrder }
  }
  refund(orderId) { /* maps orders, marks REFUNDED and saves */ }
}
```

Reason and SOLID mapping:
- Single Responsibility: `OrderService` now owns order-related rules only.
- Dependency Inversion: `OrderService` receives `storage`, `payment`, `notification` implementations.
- Open/Closed: promo rules or payment strategies can be extended without changing consumers.

------------------------------------------------------------

Quick notes and next steps

- To test business rules add unit tests targeting `src/services/orderService.js` — no UI needed.
- To change storage (e.g., move to indexedDB or server), implement the same methods on a new storage class and inject it.
- To add a new payment provider, add a new strategy to the `PaymentService` strategies map.

How to run locally:
```bash
cd solid-code-bad-to-good
npm install
npm run dev
```

If you'd like, I can:
- start the dev server now, or
- add unit tests for `OrderService` demonstrating isolated behavior.

---
Generated on May 21, 2026.
