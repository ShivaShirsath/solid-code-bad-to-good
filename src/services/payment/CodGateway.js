export class CodGateway {
  process(order) {
    console.log(`[CodGateway] Cash on delivery confirmed for order ${order.id}`);
    return true;
  }
}
