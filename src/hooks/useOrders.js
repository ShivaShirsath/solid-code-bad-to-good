import { useState, useEffect } from "react";
import { loadOrders, saveOrders } from "../services/storage";

export function useOrders() {
  const [orders, setOrders] = useState([]);

  // Load from storage once
  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  // Save to storage whenever orders change
  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  return [orders, setOrders];
}
