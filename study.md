# SOLID Refactoring Study

## Original Problems in `App.jsx`

The original `App.jsx` file violated several SOLID principles:

### 1. Single Responsibility Principle (SRP)
- **Problem:** The component handled UI, business logic (pricing, discounts), infrastructure (localStorage, fetch), reporting (CSV export), and notifications (alert, message state) all in one place.
- **Consequence:** Hard to maintain, test, and extend. Any change in one concern could break others.

### 2. Open/Closed Principle (OCP)
- **Problem:** Adding new payment methods, discount rules, or item types required modifying the core logic in multiple places.
- **Consequence:** Code was not easily extensible and prone to bugs when requirements changed.

### 3. Dependency Inversion Principle (DIP)
- **Problem:** The component depended directly on low-level details (localStorage, fetch, alert) instead of abstracting them behind interfaces or services.
- **Consequence:** Tight coupling to implementation details, making it hard to swap or mock dependencies.

### 4. Interface Segregation Principle (ISP) & Liskov Substitution Principle (LSP)
- **Problem:** Not directly violated, but the design did not use abstractions or interfaces, so substitutability and separation of concerns were not considered.

---

## Refactoring: What Was Changed

### 1. Extracted Helper Modules
- **catalog.js:** Single source of truth for item catalog and prices.
- **pricingService.js:** Handles pricing and discount logic.
- **orderService.js:** Handles order creation and refund logic.
- **storageService.js:** Handles localStorage operations.
- **notificationService.js:** Handles notifications and external effects (alert, fetch).
- **paymentService.js:** Handles payment logic and can be extended for new payment types.

### 2. Updated `App.jsx`
- Now only manages UI and state.
- Delegates all business logic, storage, and side effects to helper modules.
- Uses the catalog for item options, pricingService for price calculation, orderService for order/refund, storageService for persistence, notificationService for notifications, and paymentService for payment processing.

---

## Benefits After Refactoring

- **SRP:** Each module/class has a single responsibility.
- **OCP:** New payment methods, discounts, or storage mechanisms can be added by extending modules, not modifying core logic.
- **DIP:** The component depends on abstractions (helper modules), not low-level APIs.
- **Testability:** Each module can be tested independently.
- **Maintainability:** Code is easier to read, maintain, and extend.

---

## Example: Before vs After

**Before:**
- All logic in one file/component.
- Direct use of localStorage, fetch, alert, and business rules.

**After:**
- UI logic in `App.jsx` only.
- All business logic, storage, and side effects are delegated to specialized modules.

---

## App.jsx Structure and Flow

### Components
- **App**: The main and only component in this file. It manages the entire UI and state for the commerce admin panel.

### Functions
- **buyNow**: Handles order creation, payment processing, notifications, and updates the message state.
- **refund**: Handles refunding an order and updates the message state.
- **exportReport**: Generates a CSV export of orders and calculates revenue.

### Hooks Used
- **useState**: Manages local state for user, item, qty, payment, orders, and message.
- **useEffect**: 
    - On mount: Loads orders from localStorage using the storage service.
    - On orders change: Saves orders to localStorage using the storage service.

### Step-by-Step Execution
1. **Component Mounts**:
    - `useEffect` loads orders from storage and sets them in state.
2. **User Interacts with UI**:
    - User selects item, quantity, payment method, and enters user name.
    - On clicking "Buy":
        - `buyNow` calculates price, processes payment, creates order, sends notifications, and updates state.
    - On clicking "Export CSV + Revenue":
        - `exportReport` generates a CSV and shows revenue.
    - On clicking "Refund":
        - `refund` updates the order status and message.
3. **Orders State Changes**:
    - `useEffect` saves updated orders to storage.

### Uses of Hooks and Components
- **useState**: Keeps UI reactive to user input and order changes.
- **useEffect**: Ensures persistent storage of orders and initializes state from storage.
- **App Component**: Orchestrates UI, delegates logic to helpers, and renders forms, tables, and messages.

---

## Conclusion

The refactoring applies SOLID principles, resulting in a modular, maintainable, and extensible codebase. Each concern is separated, and the app is now easier to test and evolve.
