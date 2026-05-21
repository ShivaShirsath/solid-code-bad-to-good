/*
========================================================
PRICING SERVICE
========================================================

SOLID PRINCIPLE:
----------------
SRP (Single Responsibility Principle)

WHY?
----
Only handles pricing logic.
No UI.
No payment.
No storage.
========================================================
*/

class PricingService {

  static getItemPrice(item) {

    const prices = {
      laptop: 1000,
      phone: 500,
      headset: 50,
      misc: 20
    };

    return prices[item] || 20;
  }


  static calculateTotal(user, item, qty) {

    let total =
      this.getItemPrice(item) * qty;

    // VIP discount
    if (user === "vip") {
      total *= 0.7;
    }

    // Bulk discount
    else if (qty > 10) {
      total *= 0.85;
    }

    return total;
  }
}

export default PricingService;