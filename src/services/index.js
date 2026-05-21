// Service exports for easy importing
// Dependency Injection point for the application

export { getItemPrice, calculateTotal } from './pricing';
export { processPayment, PaymentStrategies, getAvailablePaymentMethods } from './paymentMethods';
export { notifyCustomer, NotificationChannels } from './notifications';
export { generateCSVReport, calculateRevenue, exportCSV } from './reports';
export { createOrder, refundOrder, findOrderById, getOrdersByUser } from './orders';
export { StorageService } from './storage';
