export const emailNotifier = {
  async notify({ user, order }) {
    await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: `${user}@mail.com`,
        text: `Order ${order.id} confirmed`,
      }),
    }).catch(() => {});
  },
};
