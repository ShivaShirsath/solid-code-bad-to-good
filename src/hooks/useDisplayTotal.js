import { useMemo } from "react";
import { getPriceForItem, calculateTotal } from "../services/pricing";
import { applyDiscount } from "../services/discounts";

export function useDisplayTotal(item, qty, user) {
  const displayTotal = useMemo(() => {
    const price = getPriceForItem(item);
    let total = calculateTotal(price, Number(qty) || 0);
    total = applyDiscount(total, user, Number(qty) || 0);
    return total.toFixed(2);
  }, [item, qty, user]);

  return displayTotal;
}
