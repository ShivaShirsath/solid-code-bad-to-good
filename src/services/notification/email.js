import { Notifier } from "./base";

export class EmailNotifier extends Notifier {
  constructor() {
    super("email");
  }

  async send(order) {
    const to = `${order.user}@mail.com`;
    const text = `Order ${order.id} confirmed`;
    
    console.log(`Sending email to ${to}...`);

    try {
      await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, text })
      });
      console.log(`Email successfully dispatched for order ${order.id}`);
    } catch (error) {
      console.error(`Failed to send email notification for order ${order.id}:`, error);
    }
  }
}
