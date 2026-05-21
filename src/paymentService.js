const ITEM_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20,
};

const paymentProcessors = {
  card: () => {
    console.log("Processing payment through card gateway");
    return true;
  },
  paypal: () => {
    console.log("Processing payment through PayPal");
    return true;
  },
  cod: () => {
    console.log("Processing Cash on Delivery");
    return true;
  },
};

export function getItemPrice(item) {
  return ITEM_PRICES[item] ?? ITEM_PRICES.misc;
}

export function applyDiscount(total, user, qty) {
  if (user === "vip") return total * 0.7;
  if (Number(qty) > 10) return total * 0.85;
  return total;
}

export function processPayment(method) {
  const processor = paymentProcessors[method];
  return processor ? processor() : false;
}
