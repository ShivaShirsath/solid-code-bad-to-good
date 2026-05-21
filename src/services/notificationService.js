export function notifyOrderCreated(order) {
  return fetch("https://httpbin.org/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: `${order.user}@mail.com`, text: `Order ${order.id} confirmed` })
  }).catch((error) => {
    console.warn("Order notification failed", error);
  });
}

export function sendSms(user, message) {
  window.alert(`SMS to ${user}: ${message}`);
}
