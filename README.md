# React + Vite SOLID Exercise (Resolved Version)

Hello only!

This project started from a deliberately bad, real-world style e-commerce admin flow and is now refactored to follow SOLID principles.

## Run
```bash
npm install
npm run dev
```

## What was wrong (violations)

### 1) Single Responsibility Principle (SRP) violation
- `src/App.jsx` originally handled UI rendering, pricing, discounts, payment logic, notification side effects, local storage, refund state changes, and CSV reporting.

### 2) Open/Closed Principle (OCP) violation
- Adding payment types required editing `if/else` blocks in the main component.
- Adding notification channels required changing core flow code.

### 3) Liskov Substitution Principle (LSP) risk
- No formal contract-like behavior for payment/notification handlers, increasing risk of inconsistent replacement behavior.

### 4) Interface Segregation Principle (ISP) violation tendency
- UI depended on a giant mixed API from one component instead of small, focused interfaces.

### 5) Dependency Inversion Principle (DIP) violation
- High-level order flow depended directly on concrete details (`fetch`, `alert`, `localStorage`, inline payment branches).

## How it was resolved

### SRP resolved
Code is split by responsibility:
- Domain rules:
  - `src/domain/catalog.js`
  - `src/domain/discountPolicy.js`
  - `src/domain/orderFactory.js`
- Application orchestration:
  - `src/adapters/orderAppService.js`
- Infrastructure/persistence:
  - `src/repositories/orderRepository.js`
- Integrations:
  - `src/services/paymentProcessors.js`
  - `src/services/paymentService.js`
  - `src/services/notifiers.js`
  - `src/services/notificationService.js`
  - `src/services/reportService.js`
- UI-only components:
  - `src/ui/OrderForm.jsx`
  - `src/ui/OrdersTable.jsx`
  - `src/App.jsx` (wiring/orchestration only)

### OCP resolved
- New payment method: implement a new processor class and register it in `PaymentService` map.
- New notification channel: implement a notifier class and add it to `NotificationService` list.
- Core order flow (`OrderAppService`) stays unchanged.

### LSP improved
- Payment processors all expose `pay(payload)`.
- Notifiers all expose `notify(payload)`.
- Services operate on behavior contracts, so implementations can be swapped consistently.

### ISP improved
- UI consumes focused props from dedicated components (`OrderForm`, `OrdersTable`) instead of a monolithic interface.
- App logic is exposed through narrow app-service methods:
  - `placeOrder`
  - `refundOrder`
  - `exportOrdersReport`
  - `loadOrders`

### DIP resolved
- High-level flow in `OrderAppService` depends on abstractions/collaborators injected at creation time.
- Concrete infrastructure concerns are moved to repository/services and composed in `createOrderAppService()`.

## Real-world benefits after refactor
- Easier to test business logic without React rendering.
- Lower risk changes when adding payment or notification capabilities.
- Better maintainability via clear module boundaries.
- Cleaner UI components focused on user interaction.
