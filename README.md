# Practical Exercise for Trainees (React Real-World Edition) - Refactored Solution

This repository contains the **optimized, SOLID-compliant** solution to a deliberately badly written React e-commerce admin module.

> **View the Original "Bad" Code:**
> To see the unoptimized version of this application (which contained massive SOLID principle violations inside a single "God Object" component), please check the main branch of this repository: 
> [avadhoot7004/solid-code-bad-to-good (main branch)](https://github.com/avadhoot7004/solid-code-bad-to-good)

## Refactoring Overview

The original code suffered from having multiple business rules (pricing, discounts, payment, order state), side effects (HTTP calls, alerts, CSV export), and persistence concerns mixed entirely within the `App.jsx` UI component.

We refactored this into a highly maintainable architecture applying **SOLID Principles**:

1. **Single Responsibility Principle (SRP) & Interface Segregation Principle (ISP)**
   - Extracted all domain logic into focused services: `PricingService`, `NotificationService`, and `ReportService`.
   - `App.jsx` is now purely responsible for view rendering and orchestration.

2. **Open/Closed Principle (OCP) & Liskov Substitution Principle (LSP)**
   - Implemented the **Strategy Pattern** for payments inside `PaymentStrategies.js`. The application can now support new payment methods seamlessly without modifying existing `if/else` logic.
   - Pricing and discounts are dynamically calculated without being hardcoded into the component.

3. **Dependency Inversion Principle (DIP)**
   - Moved `localStorage` interactions behind an `OrderRepository` abstraction. The app no longer relies directly on browser storage APIs.

4. **Clean State Management**
   - Introduced a custom hook (`useOrders`) to handle React state synchronization with our repository.

## Run

```bash
npm install
npm run dev
```

## New Architecture Structure
- `src/App.jsx` (Refactored to pure UI presentation)
- `src/hooks/useOrders.js` (State & sync orchestration)
- `src/services/PricingService.js` (Domain logic)
- `src/services/PaymentStrategies.js` (Strategy pattern for processing)
- `src/services/NotificationService.js` (Abstracted side effects)
- `src/services/ReportService.js` (Abstracted CSV generation)
- `src/repositories/OrderRepository.js` (Data persistence abstraction)
- `src/styles.css`
