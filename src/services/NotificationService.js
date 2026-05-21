export async function sendEmail(order) {
  try {
    await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: `${order.user}@mail.com`,
        text: `Order ${order.id} confirmed`
      })
    });
  } catch {}
}

export function sendSMS(order) {
  alert(`SMS to ${order.user}: Order ${order.id} placed`);
}