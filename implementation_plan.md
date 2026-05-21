# SOLID Principles Refactoring Plan

This document outlines the SOLID principle violations found in `src/App.jsx` and proposes a comprehensive architectural refactoring plan.

## User Review Required

> [!IMPORTANT]  
> Please review the proposed architecture and directory structure below. Let me know if you agree with this separation of concerns before I begin the execution phase.

## SOLID Violations Analysis

### 1. Single Responsibility Principle (SRP)
**Violation**: `App.jsx` is a massive "God Object" component. It currently handles:
- UI Rendering & State Management
- Complex business logic (calculating prices and applying discounts)
- External side-effects and API calls (fetch emails, SMS alerts)
- Payment processing routing
- Data persistence (`localStorage`)
- Report generation (CSV Blob generation)

**Suggestion**: Extract each responsibility into its own dedicated class, function, or custom hook. The `App` component should only be responsible for connecting the UI to these external services.

### 2. Open/Closed Principle (OCP)
**Violation**: 
- The pricing logic (`if (item === "laptop") ... else if ...`) and discount logic (`if (user === "vip")`) are hardcoded. Adding a new item or user tier requires modifying the core function.
- The payment processing logic (`if (payment === "card") ...`) forces us to modify `App.jsx` every time a new payment method is supported.

**Suggestion**: Use the **Strategy Pattern** for payments (e.g., `CardProcessor`, `PaypalProcessor`) and configuration objects or registries for pricing and discounts. This allows us to extend functionality by adding new files/classes rather than modifying existing code.

### 3. Liskov Substitution Principle (LSP)
**Violation**: While JS doesn't have strict interfaces, the `buyNow` function manually checks payment strings to perform wildly different operations. There is no unified way to "process a payment".
**Suggestion**: Create a common abstraction (e.g., `processPayment(amount)`) that all specific payment processors adhere to. The caller can then use any processor interchangeably without knowing its internal implementation.

### 4. Interface Segregation Principle (ISP)
**Violation**: The UI component knows too much about low-level implementations. It knows the exact URL for `httpbin`, the headers required for fetch, and how to construct a `Blob` for CSV export.
**Suggestion**: Create specific interfaces/services like `NotificationService` and `ReportGenerator`. The UI should only call `NotificationService.sendOrderConfirmation(order)` and `ReportGenerator.downloadOrdersCSV(orders)`.

### 5. Dependency Inversion Principle (DIP)
**Violation**: High-level UI and business logic directly depend on low-level browser APIs (`localStorage`, `fetch`, `Date.now()`, `URL.createObjectURL`).
**Suggestion**: Depend on abstractions. Create an `OrderRepository` to handle data access. We will implement a `LocalStorageOrderRepository`, but the core logic won't care where the data comes from, making it highly testable.

---

## Proposed Changes

We will refactor the application into a layered architecture inside the `src` directory.

### Core Business Logic
These files will contain pure logic, decoupled from React and Browser APIs.

#### [NEW] `src/services/PricingService.js`
- Contains product catalogs and discount rules.
- Calculates final totals based on item, quantity, and user type.

#### [NEW] `src/services/PaymentStrategies.js`
- Implements the Strategy Pattern for payments.
- Exports `CardProcessor`, `PaypalProcessor`, `CODProcessor` with a unified `process(amount)` signature.

### Infrastructure & External Services
These files handle side-effects and external APIs.

#### [NEW] `src/services/NotificationService.js`
- Abstracts `fetch` and `alert` for emails and SMS.
- Exposes clean methods like `sendOrderConfirmation(user, orderId)`.

#### [NEW] `src/services/ReportService.js`
- Handles CSV generation, Revenue calculation, and browser file downloads.

#### [NEW] `src/repositories/OrderRepository.js`
- Abstracts `localStorage` logic. 
- Exposes `getOrders()` and `saveOrders(orders)`.

### React Application Layer
We'll clean up the UI and use custom hooks to bridge React state with our business logic.

#### [NEW] `src/hooks/useOrders.js`
- Manages `orders` state and orchestrates interactions with `OrderRepository`.

#### [MODIFY] `src/App.jsx`
- Stripped down to pure UI presentation.
- Uses the custom hooks and services to delegate actions like `buyNow` and `exportReport`.

## Verification Plan

### Automated Tests
- While we don't have a test suite currently, this refactor will make unit testing straightforward. I will verify the code compiles without syntax errors.

### Manual Verification
- We will start the development server (`npm run dev`) and manually test:
  1. Creating an order with different payment methods (Card, Paypal, COD).
  2. Verifying correct pricing and discounts (VIP vs Regular).
  3. Verifying that the UI shows success/failure messages correctly.
  4. Testing the refund functionality.
  5. Testing the CSV Export functionality to ensure it still downloads correctly.
