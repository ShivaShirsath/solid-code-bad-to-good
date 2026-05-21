export class NotificationService {
  constructor(notifiers) {
    this.notifiers = notifiers;
  }

  async notifyOrderPlaced(payload) {
    await Promise.all(this.notifiers.map((notifier) => notifier.notify(payload)));
  }
}
