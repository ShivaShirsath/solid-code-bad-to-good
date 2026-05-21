export function sendEmail(user, orderId) {

  console.log(
    `Email sent to ${user} for order ${orderId}`
  );
}

export function sendSMS(user, orderId) {

  alert(
    `SMS sent to ${user} for order ${orderId}`
  );
}