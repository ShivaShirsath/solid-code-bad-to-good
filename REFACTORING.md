# SOLID Refactoring Notes

## 1. SOLID violations in the original `App.jsx`

### Single Responsibility (SRP)
One component owned:
- React UI and form state
- Pricing and discount rules
- Payment gateway branching
- Order lifecycle (create, refund)
- `localStorage` persistence
- HTTP email notification and SMS `alert`
- CSV export and revenue calculation

Any change to business rules, infrastructure, or layout forced edits in the same file.

### Open/Closed (OCP)
`buyNow()` used long `if/else` chains for:
- item prices
- discounts (VIP vs bulk qty)
- payment methods

Adding a payment provider, discount type, or notifier required modifying `buyNow()` instead of extending behavior.

### Liskov Substitution (LSP)
Not modeled explicitly, but payment and notification paths were inconsistent ad-hoc branches rather than interchangeable implementations.

### Interface Segregation (ISP)
There were no narrow contracts. UI code depended on concrete `fetch`, `alert`, and `localStorage` details.

### Dependency Inversion (DIP)
High-level checkout flow depended on low-level details (`fetch`, `alert`, `localStorage`, DOM download) inside the component instead of abstractions injected from the outside.

---

## 2. Target architecture

```
src/
  App.jsx                 # orchestration + UI state only
  components/             # presentational UI
  hooks/                  # React wiring (orders persistence, checkout flow)
  domain/                 # pure business rules (pricing, orders)
  services/
    payment/              # payment processors (extend via registry)
    notification/         # email, SMS notifiers (compose in checkout)
    storage/              # localStorage adapter
    reporting/            # CSV export adapter
```

---

## 3. What improved and why

| Concern | Before | After | Benefit |
|--------|--------|-------|---------|
| Pricing | Inline in `buyNow` | `domain/catalog.js`, `domain/discounts.js`, `domain/pricing.js` | Testable rules; new items/discounts without touching UI |
| Payment | `if/else` in component | `services/payment/paymentProcessors.js` | Add `applePay` by registering a processor |
| Notifications | `fetch` + `alert` in `buyNow` | `emailNotifier`, `smsNotifier`, `notifyOrderPlaced` | Swap channels (Slack, push) without changing checkout |
| Persistence | `useEffect` + `localStorage` in `App` | `services/storage/localOrderStorage.js` + `useOrders` | Swap to API/IndexedDB by changing the adapter |
| Reporting | CSV + revenue in `App` | `services/reporting/csvOrderReport.js` | Export formats isolated from React |
| UI | One 160-line component | `CreateOrderForm`, `OrdersTable`, thin `App` | Components focus on rendering and event wiring |

**SRP:** Each module has one reason to change.

**OCP:** Extend payment processors, discount rules, or notifiers by adding modules—not editing checkout UI.

**DIP:** `useCheckout` orchestrates domain + injected-style services; `useOrders` depends on a storage factory, not raw `localStorage` calls in the view.

**Maintainability for growth:** New payment method → new processor object. New discount → new entry in `discountRules`. New notification → new notifier in the array passed to `useCheckout`.

Behavior is preserved from the original exercise (same prices, discounts, payment logging, httpbin email, SMS alert, CSV export, and local persistence).
