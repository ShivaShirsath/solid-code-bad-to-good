import { getItemPrice } from "./catalog.js";
import { applyDiscounts } from "./discounts.js";

export function calculateOrderTotal({ item, qty, user }) {
  const baseTotal = getItemPrice(item) * Number(qty);
  return applyDiscounts(baseTotal, { item, qty, user });
}
