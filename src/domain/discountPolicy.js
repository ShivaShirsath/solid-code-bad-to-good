export class DiscountPolicy {
  apply({ user, qty, subtotal }) {
    if (user === "vip") return subtotal * 0.7;
    if (qty > 10) return subtotal * 0.85;
    return subtotal;
  }
}
