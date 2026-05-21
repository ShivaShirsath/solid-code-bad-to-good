// Notifications are infra because they are external side effects.
// SOLID: Single Responsibility - the UI and order logic do not know how alerts or messages are delivered.
export default class NotificationService {
  async sendEmail(to, text) {
    try {
      await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, text })
      });
    } catch (error) {
      // Demo-safe fallback: the app should not crash because the demo email endpoint fails.
    }
  }

  sendSMS(user, text) {
    alert(`SMS to ${user}: ${text}`);
  }
}