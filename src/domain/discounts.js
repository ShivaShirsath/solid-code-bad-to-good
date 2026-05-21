/** First matching rule wins (same behavior as the original if/else chain). */
export const discountRules = [
  {
    applies: ({ user }) => user === "vip",
    factor: 0.7,
  },
  {
    applies: ({ qty }) => Number(qty) > 10,
    factor: 0.85,
  },
];

export function applyDiscounts(baseTotal, context) {
  const rule = discountRules.find((r) => r.applies(context));
  return rule ? baseTotal * rule.factor : baseTotal;
}
