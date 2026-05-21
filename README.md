# Practical Exercise for Trainees (React Real-World Edition)

This repository demonstrates a SOLID refactor of a badly written React commerce admin module.

## What changed
- Core domain logic is moved to focused services:
  - `src/domain/pricing.js`
  - `src/domain/discounts.js`
  - `src/domain/paymentStrategies.js`
  - `src/domain/orderFactory.js`
- External side effects are isolated behind adapters/hooks:
  - `src/hooks/useLocalStorageOrders.js`
  - `src/hooks/useApi.js`
  - `src/hooks/useCsvExport.js`
- Notifications are abstracted through:
  - `src/services/notification.js`
- Presentation is split into dumb components:
  - `src/components/OrderForm.jsx`
  - `src/components/OrdersTable.jsx`
  - `src/components/MessageBar.jsx`
- `src/App.jsx` now orchestrates calls between domain logic, adapters, and presentation components.

## SOLID alignment
- **SRP:** each module has one responsibility.
- **OCP:** payment and discount strategies can be extended without modifying the orchestration.
- **LSP:** notifier implementations can be swapped without changing caller behavior.
- **ISP:** hooks expose focused APIs for storage, API calls, and export.
- **DIP:** the app depends on abstractions and adapters, not direct browser APIs.

## Files
- `src/App.jsx` — orchestrator and composition root
- `src/components/OrderForm.jsx` — order input UI
- `src/components/OrdersTable.jsx` — orders list UI
- `src/components/MessageBar.jsx` — message display UI
- `src/domain/` — pricing, discounts, payments, order creation
- `src/hooks/` — local storage, API, CSV export adapters
- `src/services/notification.js` — swappable notification abstraction
- `src/styles.css` — application styling

## Run
```bash
npm install
npm run dev
```

## Notes
- New payment methods, discount rules, or notification channels can now be added with minimal changes to the UI layer.
- The component now focuses on orchestration, not business or infra details.
