/*
========================================================
NOTIFICATION SERVICE
========================================================

SOLID:
1. SRP
2. ISP

WHY?
----
Only handles notifications.
No payment.
No UI.
No storage.
========================================================
*/

class NotificationService {

  static sendEmail(order) {

    fetch("https://httpbin.org/post", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        to: `${order.user}@mail.com`,
        text: `Order ${order.id} confirmed`
      })

    }).catch(() => {});
  }


  static sendSMS(order) {

    alert(
      `SMS to ${order.user}: Order ${order.id} placed`
    );
  }
}

export default NotificationService;