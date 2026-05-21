import { useState, useEffect, useCallback } from "react";
import { OrderRepository } from "../repositories/OrderRepository";

export function useOrders() {
  const [orders, setOrders] = useState([]);

  // Load orders initially
  useEffect(() => {
    const loadedOrders = OrderRepository.getOrders();
    setOrders(loadedOrders);
  }, []);

  // Save orders whenever they change
  useEffect(() => {
    OrderRepository.saveOrders(orders);
  }, [orders]);

  const addOrder = useCallback((newOrder) => {
    setOrders((prev) => [...prev, newOrder]);
  }, []);

  const refundOrder = useCallback((orderId) => {
    setOrders((prev) => 
      prev.map((o) => {
        if (o.id === orderId && o.status !== "REFUNDED") {
          return { ...o, status: "REFUNDED" };
        }
        return o;
      })
    );
  }, []);

  return { orders, addOrder, refundOrder };
}
