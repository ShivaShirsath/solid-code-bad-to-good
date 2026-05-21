/**
 * notificationService.js
 *
 * S — Single Responsibility: only handles outbound notifications.
 * D — Dependency Inversion: business logic calls sendEmail / sendSMS
 *     without knowing the transport details (fetch, alert, etc.).
 */

/**
 * Sends an order-confirmation email.
 * Swap the fetch call for any email SDK without touching order logic.
 *
 * @param {{ user: string, id: number }} order
 */
export async function sendConfirmationEmail(order) {
  try {
    await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: `${order.user}@mail.com`,
        text: `Order ${order.id} confirmed`,
      }),
    });
    console.log(`[Email] Confirmation sent to ${order.user}@mail.com`);
  } catch {
    console.warn("[Email] Could not send confirmation email");
  }
}

/**
 * Sends an SMS notification.
 * Replace the alert() with a real SMS gateway call when ready.
 *
 * @param {{ user: string, id: number }} order
 */
export function sendSmsNotification(order) {
  // In production: call Twilio / AWS SNS here.
  console.log(`[SMS] Order ${order.id} placed — notifying ${order.user}`);
  alert(`SMS to ${order.user}: Order ${order.id} placed`);
}
