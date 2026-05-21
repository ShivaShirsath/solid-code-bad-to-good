import { useEffect, useState } from "react";
import { loadOrders, saveOrders } from "../services/storageService";

export function useOrders() {
  const [orders, setOrders] = useState([]);

  // Load on startup
  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  // Save whenever orders change
  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  return [orders, setOrders];
}