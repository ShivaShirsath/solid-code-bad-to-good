import React, { useState } from 'react';
import OrderForm from './components/OrderForm';
import OrdersTable from './components/OrdersTable';
import MessageBar from './components/MessageBar';
import { useLocalStorageOrders } from './hooks/useLocalStorageOrders';
import { calculateTotal } from './domain/pricing';
import { computeDiscountMultiplier } from './domain/discounts';
import { processPayment } from './domain/paymentStrategies';
import { createOrder } from './domain/orderFactory';
import { sendNotificationApi } from './hooks/useApi';
import { exportOrdersCsv } from './hooks/useCsvExport';
import { notify } from './services/notification';

export default function App() {
  const { orders, addOrder, updateOrder } = useLocalStorageOrders();
  const [message, setMessage] = useState('');

  async function handleBuy({ user, item, qty, payment }) {
    const discountFn = ({ qty: q }) => computeDiscountMultiplier({ user, qty: q });
    const total = calculateTotal({ item, qty }, discountFn);

    const paymentResult = await processPayment(payment, total);
    if (!paymentResult || paymentResult.ok === false) {
      setMessage('Payment failed');
      return;
    }

    const newOrder = createOrder({ user, item, qty, total });
    addOrder(newOrder);

    sendNotificationApi(`${user}@mail.com`, `Order ${newOrder.id} confirmed`).catch(() => {});

    notify({ message: `SMS to ${user}: Order ${newOrder.id} placed` });

    setMessage(`Order ${newOrder.id} placed. Total: ${total}`);
  }

  function handleRefund(orderId) {
    updateOrder(orderId, { status: 'REFUNDED' });
    setMessage(`Refund attempted for ${orderId}`);
  }

  function handleExport() {
    const revenue = exportOrdersCsv(orders);
    setMessage(`Revenue: ${revenue}`);
  }

  return (
    <div className="page">
      <h1>Commerce Admin (Refactored)</h1>
      <p>Refactored into Domain, Infrastructure, Notification, and Presentation layers.</p>

      <OrderForm onBuy={handleBuy} onExport={handleExport} />

      <OrdersTable orders={orders} onRefund={handleRefund} />

      <MessageBar message={message} />
    </div>
  );
}
