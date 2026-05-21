export async function sendEmail(user, orderId) {
  try {
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
  } catch (err) {
    console.error("Email failed");
  }
}

export function sendSMS(user, orderId) {
  alert(`SMS to ${user}: Order ${orderId} placed`);
}