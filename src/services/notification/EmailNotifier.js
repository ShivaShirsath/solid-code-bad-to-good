export class EmailNotifier {
  notify(order) {
    fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: `${order.user}@mail.com`,
        text: `Order ${order.id} confirmed`,
      }),
    }).catch(() => {
      console.warn("[EmailNotifier] Failed to send email notification");
    });
  }
}
