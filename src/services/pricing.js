// SOLID: Single Responsibility - Pricing calculations only
// Follows: SRP (only pricing logic), OCP (easily extensible for new discount rules)

const ITEM_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20
};

const DISCOUNT_STRATEGIES = {
  vip: (total) => total * 0.7,
  bulk: (total, qty) => qty > 10 ? total * 0.85 : total,
  default: (total) => total
};

export function getItemPrice(itemName) {
  return ITEM_PRICES[itemName] || ITEM_PRICES.misc;
}

export function calculateTotal(price, quantity, userType = 'default') {
  let total = price * Number(quantity);
  
  if (userType === 'vip') {
    return DISCOUNT_STRATEGIES.vip(total);
  } else if (userType === 'default' && Number(quantity) > 10) {
    return DISCOUNT_STRATEGIES.bulk(total, quantity);
  }
  
  return total;
}
