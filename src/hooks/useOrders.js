import { useEffect, useState } from "react";
import { refundOrder } from "../domain/orders.js";
import { createOrderStorage } from "../services/storage/localOrderStorage.js";

const defaultStorage = createOrderStorage();

export function useOrders(storage = defaultStorage) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(storage.load());
  }, [storage]);

  useEffect(() => {
    storage.save(orders);
  }, [orders, storage]);

  function addOrder(order) {
    setOrders((current) => [...current, order]);
  }

  function refund(orderId) {
    setOrders((current) => refundOrder(current, orderId));
  }

  return { orders, addOrder, refund };
}
