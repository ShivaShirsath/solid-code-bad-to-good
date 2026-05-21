export class SmsNotifier {
  notify(order) {
    alert(`SMS to ${order.user}: Order ${order.id} placed`);
  }
}
