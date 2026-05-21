
export async function sendEmailNotification(order) {
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
  } catch (error) {
    console.error("Email notification failed");
  }
}

export function sendSMSNotification(order) {
  alert(`SMS to ${order.user}: Order ${order.id} placed`);
}