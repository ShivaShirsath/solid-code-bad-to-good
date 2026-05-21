export async function sendEmail(to, text) {
  try {
    await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, text }),
    });
  } catch (e) {
    console.warn("email failed", e);
  }
}

export async function sendSMS(user, text) {
  // keep side-effect isolated; real implementation can be swapped
  console.log(`[notification] SMS to ${user}: ${text}`);
}

export async function notifyOrderPlaced(order) {
  await Promise.all([
    sendEmail(`${order.user}@mail.com`, `Order ${order.id} confirmed`),
    sendSMS(order.user, `Order ${order.id} confirmed`),
  ]);
}
