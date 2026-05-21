export class NotificationService {

  static async sendEmail(user, orderId) {
    try {
      await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: `${user}@mail.com`,
          text: `Order ${orderId} confirmed`
        })
      });
    } catch (error) {
      console.error(error);
    }
  }

  static sendSMS(user, orderId) {
    alert(`SMS to ${user}: Order ${orderId} placed`);
  }
}