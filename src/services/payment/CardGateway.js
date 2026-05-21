export class CardGateway {
  process(order) {
    console.log(`[CardGateway] Processing card payment for order ${order.id} — $${order.total}`);
    return true;
  }
}
