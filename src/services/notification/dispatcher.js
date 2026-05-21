import { EmailNotifier } from "./email";
import { SMSNotifier } from "./sms";

export class NotificationDispatcher {
  constructor() {
    // Easily add or remove channels here to comply with OCP
    this.channels = [
      new EmailNotifier(),
      new SMSNotifier()
    ];
  }

  /**
   * Broadcasts the order placement event to all active notification channels.
   * 
   * @param {Object} order - The placed order object
   */
  async dispatch(order) {
    const dispatchPromises = this.channels.map(channel => 
      channel.send(order).catch(error => {
        console.error(`Failed to send notification via ${channel.name} channel:`, error);
      })
    );
    
    // Broadcast notifications asynchronously in parallel
    await Promise.all(dispatchPromises);
  }
}

export const notificationDispatcher = new NotificationDispatcher();
