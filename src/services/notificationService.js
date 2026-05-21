export async function sendEmailConfirmation(user, orderId) {
  try {
    await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to:   `${user}@mail.com`,
        text: `Order ${orderId} confirmed`,
      }),
    });
  } catch {
    console.warn("Email notification failed");
  }
}

export function sendSMSAlert(user, orderId) {
  alert(`SMS to ${user}: Order ${orderId} placed`);
}