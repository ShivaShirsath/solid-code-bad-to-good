import { prices } from "../constant";

function getItemPrice(item) {
  return prices[item] ?? prices.misc;
}

function applyDiscount(total, user, qty) {
  if (user === "vip") return total * 0.7;
  if (qty > 10) return total * 0.85;
  return total;
}

export function calculateTotal(item, qty, user) {
  const subtotal = getItemPrice(item) * qty;
  return applyDiscount(subtotal, user, qty);
}