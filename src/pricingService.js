// Handles pricing and discount logic
import { CATALOG } from "./catalog";

export function calculatePrice(item, qty, user) {
  let price = CATALOG[item]?.price || 0;
  let total = price * Number(qty);
  if (user === "vip") total *= 0.7;
  else if (Number(qty) > 10) total *= 0.85;
  return total;
}
