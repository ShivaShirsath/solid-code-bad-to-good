export async function sendEmailNotification(user, orderId) {
  await fetch("https://httpbin.org/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      to: `${user}@mail.com`,
      text: `Order ${orderId} confirmed`
    })
  });
}

export function sendSMS(user, orderId) {
  alert(`SMS to ${user}: Order ${orderId} placed`);
}