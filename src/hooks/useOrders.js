import { useEffect, useState } from "react";
import { orderRepository } from "../repositories/orderRepository";

export function useOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(orderRepository.getAll());
  }, []);

  useEffect(() => {
    orderRepository.saveAll(orders);
  }, [orders]);

  function addOrder(order) {
    setOrders((prev) => [...prev, order]);
  }

  function refundOrder(orderId) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId && o.status !== "REFUNDED"
          ? { ...o, status: "REFUNDED" }
          : o
      )
    );
  }

  return {
    orders,
    addOrder,
    refundOrder
  };
}