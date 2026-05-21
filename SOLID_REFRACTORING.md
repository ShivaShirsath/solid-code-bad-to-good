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

--------
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
# SOLID Refactor Trace

This document is a step-by-step trace of the modular refactor. The goal was to keep the UI thin and move business logic, infra, and calculations into separate folders.

Final folder shape:

- `src/components` - presentational React components
- `src/utils` - pure helper functions
- `src/services` - business orchestration
- `src/payments` - payment strategy and payment config
- `src/infra` - browser and external side effects

Files in the new modular layout:

- [src/App.jsx](src/App.jsx)
- [src/components/OrderForm.jsx](src/components/OrderForm.jsx)
- [src/components/OrdersTable.jsx](src/components/OrdersTable.jsx)
- [src/utils/orderMath.js](src/utils/orderMath.js)
- [src/services/orderService.js](src/services/orderService.js)
- [src/services/reportService.js](src/services/reportService.js)
- [src/payments/paymentService.js](src/payments/paymentService.js)
- [src/payments/defaultStrategies.js](src/payments/defaultStrategies.js)
- [src/infra/storage/storageService.js](src/infra/storage/storageService.js)
- [src/infra/notification/notificationService.js](src/infra/notification/notificationService.js)

------------------------------------------------------------

1) `src/App.jsx`

What changed:
- It no longer contains pricing, payment branching, report logic, or storage code.
- It now only composes the smaller pieces and keeps page state.

Before:
```js
function buyNow() {
  let price = 20;
  if (item === "laptop") price = 1000;
  if (payment === "card") console.log("Calling card gateway directly");
  fetch("https://httpbin.org/post", ...);
  alert(`SMS to ${user}: Order ${newOrder.id} placed`);
}
```

After:
```js
function buyNow() {
  const result = orderService.createOrder({ user, item, qty, paymentMethod });
  if (!result.success) {
    setMessage("Payment failed");
    return;
  }
  setOrders(orderService.getAll());
}
```

Why:
- Single Responsibility: `App` is now a composition layer.
- Dependency Inversion: `App` depends on services, not browser APIs.

------------------------------------------------------------

2) `src/components/OrderForm.jsx`

What changed:
- The order form was extracted from `App` into a reusable presentational component.
- It only receives props and emits events.

Before:
```js
<label>User</label>
<input value={user} onChange={(e) => setUser(e.target.value)} />
```

After:
```js
export default function OrderForm({ user, onUserChange, onBuy }) {
  return <input value={user} onChange={(e) => onUserChange(e.target.value)} />;
}
```

Why:
- Interface Segregation: the component gets only what it needs.
- Single Responsibility: no business logic is mixed into the form UI.

------------------------------------------------------------

3) `src/components/OrdersTable.jsx`

What changed:
- The orders table was extracted from `App`.
- It owns only rendering and the refund button.

Before:
```js
{orders.map((o) => (
  <tr key={o.id}>
    <td>{o.user}</td>
    <td><button onClick={() => refund(o.id)}>Refund</button></td>
  </tr>
))}
```

After:
```js
export default function OrdersTable({ orders, onRefund }) {
  return orders.map((o) => (
    <button onClick={() => onRefund(o.id)}>Refund</button>
  ));
}
```

Why:
- Single Responsibility: table rendering is separate from order rules.
- Interface Segregation: the table only uses `orders` and `onRefund`.

------------------------------------------------------------

4) `src/utils/orderMath.js`

What changed:
- Pricing, discount, and revenue calculations were moved into pure helper functions.

Before:
```js
if (user === "vip") total *= 0.7;
if (Number(qty) > 10) total *= 0.85;
```

After:
```js
export function applyDiscount(total, user, qty) {
  if (user === "vip") return total * 0.7;
  if (Number(qty) > 10) return total * 0.85;
  return total;
}
```

Why:
- Single Responsibility: calculation rules are isolated.
- Testability: these functions are easy to test without React.

------------------------------------------------------------

5) `src/payments/paymentService.js` and `src/payments/defaultStrategies.js`

What changed:
- The payment logic was split into a small dispatcher and a separate strategies file.
- Adding a new payment method now means adding a strategy entry.

Before:
```js
if (payment === "card") {
  console.log("Calling card gateway directly");
} else if (payment === "paypal") {
  console.log("Calling paypal API directly");
}
```

After:
```js
export default class PaymentService {
  process(method, payload) {
    const fn = this.strategies[method];
    if (!fn) return false;
    return fn(payload);
  }
}
```

And the default strategies:
```js
export const defaultPaymentStrategies = {
  card: ({ total }) => true,
  paypal: ({ total }) => true,
  cod: () => true
};
```

Why:
- Open/Closed: extend payment options without rewriting the service.
- Single Responsibility: one file chooses the method, another defines the strategies.

------------------------------------------------------------

6) `src/infra/storage/storageService.js`

What changed:
- `localStorage` moved out of the UI and into the infra layer.

Before:
```js
const stored = localStorage.getItem("orders");
localStorage.setItem("orders", JSON.stringify(orders));
```

After:
```js
export default class StorageService {
  getAll() { ... }
  saveAll(items) { ... }
}
```

Why:
- Dependency Inversion: the business layer uses a storage abstraction.
- Single Responsibility: browser storage is handled in one place.

------------------------------------------------------------

7) `src/infra/notification/notificationService.js`

What changed:
- Email and SMS side effects moved out of the UI and into the infra layer.

Before:
```js
fetch("https://httpbin.org/post", ...);
alert(`SMS to ${user}: Order ${newOrder.id} placed`);
```

After:
```js
export default class NotificationService {
  async sendEmail(to, text) { ... }
  sendSMS(user, text) { ... }
}
```

Why:
- Single Responsibility: communication side effects are isolated.
- Open/Closed: the implementation can be replaced later without changing callers.

------------------------------------------------------------

8) `src/services/orderService.js`

What changed:
- Order creation, discounting, payment handling, persistence, and refund updates are grouped here.
- It now uses the pure helpers from `utils` and injected infra services.

Before:
```js
let total = price * Number(qty);
setOrders([...orders, newOrder]);
fetch(...);
alert(...);
```

After:
```js
const price = this._priceForItem(item);
let total = price * Number(qty);
total = this._applyDiscount(total, user, qty);
const paid = this.payment.process(paymentMethod, { total, user });
```

Why:
- Single Responsibility: it owns order rules only.
- Dependency Inversion: it depends on `storage`, `payment`, and `notification` abstractions.

------------------------------------------------------------

9) `src/services/reportService.js`

What changed:
- CSV export remains in service code, but revenue logic now comes from a pure utility.

Before:
```js
let revenue = 0;
orders.forEach((o) => { if (o.status !== "REFUNDED") revenue += o.total; });
```

After:
```js
export default class ReportService {
  revenue(orders) {
    return calculateRevenue(orders);
  }
}
```

Why:
- Single Responsibility: export/reporting stays in one service.
- Reuse: revenue calculation is shared and pure.

------------------------------------------------------------

What this modular structure gives you

- UI components stay small and easy to scan.
- Business logic is isolated in `services` and `utils`.
- Browser and external side effects stay in `infra`.
- Payment behavior can grow in `payments` without editing the UI.

How to run:
```bash
cd solid-code-bad-to-good
npm install
npm run dev
```

Generated on May 21, 2026.
