export const smsNotifier = {
  async notify({ user, order }) {
    alert(`SMS to ${user}: Order ${order.id} placed`);
  },
};
