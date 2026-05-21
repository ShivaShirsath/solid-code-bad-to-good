// Handles payment logic
export function processPayment(payment) {
  if (payment === "card") {
    return { success: true, message: "Card payment processed" };
  } else if (payment === "paypal") {
    return { success: true, message: "Paypal payment processed" };
  } else if (payment === "cod") {
    return { success: true, message: "Cash on delivery" };
  } else {
    return { success: false, message: "Payment failed" };
  }
}
