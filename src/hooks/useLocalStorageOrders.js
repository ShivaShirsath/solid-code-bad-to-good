import { useCallback, useEffect, useState } from 'react';

export function useLocalStorageOrders(key = 'orders') {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setOrders(JSON.parse(stored));
    } catch (e) {
      setOrders([]);
    }
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(orders));
    } catch (e) {
      // ignore
    }
  }, [key, orders]);

  const addOrder = useCallback((order) => {
    setOrders((prev) => [...prev, order]);
  }, []);

  const updateOrder = useCallback((id, patch) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }, []);

  const clearOrders = useCallback(() => setOrders([]), []);

  return { orders, addOrder, updateOrder, clearOrders };
}
