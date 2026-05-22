export class EmailNotifier {
  async notify({ user, orderId }) {
    await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: `${user}@mail.com`,
        text: `Order ${orderId} confirmed`
      })
    }).catch(() => {});
  }
}

export class SmsNotifier {
  async notify({ user, orderId }) {
    alert(`SMS to ${user}: Order ${orderId} placed`);
  }
}
