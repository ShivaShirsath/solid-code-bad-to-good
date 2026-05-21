export function applyDiscount(user, total, qty) {
  if (user === "vip") {
    return total * 0.7;
  }

  if (Number(qty) > 10) {
    return total * 0.85;
  }

  return total;
}