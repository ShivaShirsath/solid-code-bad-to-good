// NotificationService centralizes side effects like emails/SMS.
// SOLID: Single Responsibility - keeps external communication code out of UI components.
export default class NotificationService {
  constructor() {}

  async sendEmail(to, text) {
    // In real app this would call an API. Keep simple and resilient here.
    try {
      await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, text })
      });
    } catch (e) {
      // swallow for demo - UI should handle important failures
    }
  }

  sendSMS(user, text) {
    // Small abstraction so UI doesn't call alert() directly.
    // In production replace with proper SMS gateway.
    alert(`SMS to ${user}: ${text}`);
  }
}
