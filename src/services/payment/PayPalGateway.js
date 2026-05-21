export class PayPalGateway {
  process(order) {
    console.log(`[PayPalGateway] Calling PayPal API for order ${order.id} — $${order.total}`);
    return true;
  }
}
