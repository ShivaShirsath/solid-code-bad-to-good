import { useEffect, useState } from "react";

import {
  loadOrders,
  saveOrders
} from "../all_services/storage/OrderStorage";

export function useOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  return {
    orders,
    setOrders
  };
}