export class NotificationService {
  constructor(sender) {
    this.sender = sender;
  }

  async notify(recipient, message) {
    return this.sender.send(recipient, message);
  }
}

export const httpNotificationSender = {
  async send(recipient, message) {
    return fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: recipient, text: message })
    });
  }
};

export const alertNotificationSender = {
  async send(recipient, message) {
    alert(`SMS to ${recipient}: ${message}`);
    return Promise.resolve();
  }
};

export class CompositeNotificationService extends NotificationService {
  constructor(senders) {
    super({
      async send(recipient, message) {
        await Promise.all(senders.map((sender) => sender.send(recipient, message)));
      }
    });
  }
}

export const notificationService = new CompositeNotificationService([
  httpNotificationSender,
  alertNotificationSender
]);
