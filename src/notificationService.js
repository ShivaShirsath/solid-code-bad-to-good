export function notifyCustomer(user, orderId) {
  fetch("https://httpbin.org/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: `${user}@mail.com`, text: `Order ${orderId} confirmed` }),
  }).catch(() => {});
  alert(`SMS to ${user}: Order ${orderId} placed`);
}
