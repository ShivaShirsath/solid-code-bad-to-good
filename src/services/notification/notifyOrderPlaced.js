export async function notifyOrderPlaced(notifiers, context) {
  await Promise.all(notifiers.map((notifier) => notifier.notify(context)));
}
