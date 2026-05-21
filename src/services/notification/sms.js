import { Notifier } from "./base";

export class SMSNotifier extends Notifier {
  constructor() {
    super("sms");
  }

  async send(order) {
    const message = `SMS to ${order.user}: Order ${order.id} placed`;
    console.log("Triggering SMS notification: " + message);
    
    // We defer the alert slightly so it does not block the UI rendering flow thread instantly
    setTimeout(() => {
      alert(message);
    }, 100);
  }
}
