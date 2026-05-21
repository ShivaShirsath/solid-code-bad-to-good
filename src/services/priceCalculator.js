const PRICE_LIST = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20
};

const VIP_DISCOUNT = 0.7;
const BULK_DISCOUNT = 0.85;

export function calculateOrderTotal(item, qty, user) {
  const price = PRICE_LIST[item] ?? PRICE_LIST.misc;
  const baseTotal = price * qty;

  if (user === "vip") {
    return baseTotal * VIP_DISCOUNT;
  }

  if (qty > 10) {
    return baseTotal * BULK_DISCOUNT;
  }

  return baseTotal;
}

export function getItemPrice(item) {
  return PRICE_LIST[item] ?? PRICE_LIST.misc;
}
