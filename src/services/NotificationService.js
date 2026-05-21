export class NotificationService {
  /**
   * Sends an order confirmation via available channels (SMS, Email).
   */
  static sendOrderConfirmation(user, orderId) {
    this._sendEmail(user, `Order ${orderId} confirmed`);
    this._sendSMS(user, `Order ${orderId} placed`);
  }

  static _sendEmail(user, text) {
    // Fake external side effects isolated from UI
    fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: `${user}@mail.com`, text }),
    }).catch((err) => console.error("Email failed:", err));
  }

  static _sendSMS(user, text) {
    // In a real app, this would call an SMS API (like Twilio)
    // For this example, it preserves the original alert behavior, but 
    // extracts it from the core UI flow.
    alert(`SMS to ${user}: ${text}`);
  }
}
