import { useState, useCallback } from "react";

export function useOrderForm() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");

  const handleUserChange = useCallback((e) => setUser(e.target.value), []);
  const handleItemChange = useCallback((e) => setItem(e.target.value), []);
  const handleQtyChange = useCallback((e) => setQty(e.target.value), []);
  const handlePaymentChange = useCallback((e) => setPayment(e.target.value), []);

  return {
    user,
    item,
    qty,
    payment,
    handlers: {
      handleUserChange,
      handleItemChange,
      handleQtyChange,
      handlePaymentChange
    }
  };
}
