// SOLID: Single Responsibility - Notifications only
// Follows: SRP (notification logic separated), ISP (small focused interface)

export const NotificationChannels = {
  email: (user, message) => {
    console.log(`[EMAIL] Sending to ${user}@mail.com: ${message}`);
    return fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: `${user}@mail.com`, text: message })
    }).catch(() => console.error('Email service unavailable'));
  },

  sms: (user, message) => {
    console.log(`[SMS] Sending to ${user}: ${message}`);
    // Would call SMS gateway API here
  },

  ui: (message) => {
    console.log(`[UI] Displaying: ${message}`);
    // UI state is handled by React
    return message;
  }
};

export function notifyCustomer(user, orderId, total, channels = ['email', 'sms']) {
  const message = `Order ${orderId} confirmed. Total: $${total}`;

  channels.forEach(channel => {
    if (NotificationChannels[channel]) {
      if (channel === 'ui') {
        return NotificationChannels[channel](message);
      } else {
        NotificationChannels[channel](user, message);
      }
    }
  });

  return message;
}
