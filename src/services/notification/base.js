/**
 * Abstract Notification Channel interface.
 * Concrete dispatchers must implement `send`.
 */
export class Notifier {
  constructor(name) {
    this.name = name;
  }

  /**
   * Sends order notification.
   * @param {Object} order - Order details
   * @returns {Promise<void>} Resolves when sent
   */
  async send(order) {
    throw new Error("send() must be implemented in subclass");
  }
}
