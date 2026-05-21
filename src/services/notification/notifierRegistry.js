import { EmailNotifier } from "./EmailNotifier.js";
import { SmsNotifier }   from "./SmsNotifier.js";

const NOTIFIERS = [
  new EmailNotifier(),
  new SmsNotifier(),
];

export function notifyAll(order) {
  NOTIFIERS.forEach((notifier) => notifier.notify(order));
}
