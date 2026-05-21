import { useEffect, useState } from "react";
import { OrderRepository } from "../repositories/OrderRepository";

export function useOrders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(OrderRepository.getOrders());
  }, []);

  useEffect(() => {
    OrderRepository.saveOrders(orders);
  }, [orders]);

  return {
    orders,
    setOrders
  };
}