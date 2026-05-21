// SRP: Only responsible for sending notifications (email + SMS).
// DIP: The component calls this service instead of calling fetch/alert directly.
//      Swap the implementation (e.g. real SMS provider) without touching the UI.

export function sendEmailNotification(user, order) {
  fetch("https://httpbin.org/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: `${user}@mail.com`,
      text: `Order ${order.id} confirmed`,
    }),
  }).catch(() => {});
}

export function sendSmsNotification(user, order) {
  // In production replace alert() with a real SMS gateway call.
  alert(`SMS to ${user}: Order ${order.id} placed`);
}
