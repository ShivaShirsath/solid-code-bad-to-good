// Handles notifications and external effects
export function notifyUser(user, orderId) {
  alert(`SMS to ${user}: Order ${orderId} placed`);
}

export function sendEmail(user, orderId) {
  fetch("https://httpbin.org/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: `${user}@mail.com`, text: `Order ${orderId} confirmed` })
  }).catch(() => {});
}
