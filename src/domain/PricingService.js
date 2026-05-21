const ITEM_PRICES = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20,
};

export class PricingService {
  static getItemPrice(item) {
    return ITEM_PRICES[item] ?? ITEM_PRICES.misc;
  }

  static calculateOrderTotal({ item, qty, user }) {
    const quantity = Number(qty);
    const price = PricingService.getItemPrice(item) * quantity;

    if (user === "vip") return price * 0.7;
    if (quantity > 10) return price * 0.85;
    return price;
  }
}
