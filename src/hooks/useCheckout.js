import { createOrder } from "../domain/orders.js";
import { calculateOrderTotal } from "../domain/pricing.js";
import { emailNotifier } from "../services/notification/emailNotifier.js";
import { notifyOrderPlaced } from "../services/notification/notifyOrderPlaced.js";
import { smsNotifier } from "../services/notification/smsNotifier.js";
import { processPayment } from "../services/payment/paymentProcessors.js";

const defaultNotifiers = [emailNotifier, smsNotifier];

export function useCheckout({ addOrder, notifiers = defaultNotifiers }) {
  async function checkout({ user, item, qty, payment }) {
    const paymentResult = await processPayment(payment);
    if (!paymentResult.success) {
      return { ok: false, message: paymentResult.message };
    }

    const total = calculateOrderTotal({ item, qty, user });
    const order = createOrder({ user, item, qty, total });
    addOrder(order);

    await notifyOrderPlaced(notifiers, { user, order });

    return {
      ok: true,
      message: `Order ${order.id} placed. Total: ${total}`,
    };
  }

  return { checkout };
}
