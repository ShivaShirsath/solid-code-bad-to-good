const PRODUCT_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20
};

export class PricingService {
  static calculate(item, qty, user) {
    const basePrice = PRODUCT_PRICES[item] || 20;

    let total = basePrice * qty;

    if (user === "vip") {
      total *= 0.7;
    } else if (qty > 10) {
      total *= 0.85;
    }

    return total;
  }
}