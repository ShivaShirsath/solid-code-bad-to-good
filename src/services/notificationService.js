/**
 * Notification service — ISP + DIP.
 *
 * Each channel is an independent adapter.  The orchestrator calls
 * `notifyOrderPlaced(order)` and doesn't know which channels fire.
 *
 * OCP: add a new channel (push, Slack, etc.) by appending to CHANNELS.
 */

/**
 * Email channel — wraps the HTTP side-effect behind a named function.
 */
async function sendEmail(order) {
  try {
    await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: `${order.user}@mail.com`,
        text: `Order ${order.id} confirmed`,
      }),
    });
    console.log(`[NotificationService] Email sent for order ${order.id}`);
  } catch {
    console.warn(`[NotificationService] Email failed for order ${order.id}`);
  }
}

/**
 * SMS channel — replaces the raw `alert()` with a named, mockable function.
 * In production this would call a Twilio/SNS SDK.
 */
function sendSms(order) {
  // alert() replaced with console so the UI isn't blocked;
  // swap for a real SMS SDK call in production.
  console.log(`[NotificationService] SMS → ${order.user}: Order ${order.id} placed`);
}

/** All active notification channels. */
const CHANNELS = [sendEmail, sendSms];

/**
 * Fires all notification channels for a newly placed order.
 * Failures in individual channels are swallowed so one bad channel
 * doesn't break the order flow.
 *
 * @param {object} order
 */
export async function notifyOrderPlaced(order) {
  await Promise.allSettled(CHANNELS.map((ch) => ch(order)));
}
