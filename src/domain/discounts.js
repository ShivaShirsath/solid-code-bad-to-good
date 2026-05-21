export function computeDiscountMultiplier({ user, qty }) {
  if (user === 'vip') return 0.7;
  if (Number(qty) > 10) return 0.85;
  return 1;
}

export const discountStrategies = {
  vip: () => 0.7,
  bulk: (qty) => (Number(qty) > 10 ? 0.85 : 1),
  none: () => 1
};
