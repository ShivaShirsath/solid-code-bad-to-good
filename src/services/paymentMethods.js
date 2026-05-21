// SOLID: Strategy Pattern for payments
// Follows: OCP (open for extension, closed for modification), SRP (payment processing only)
// Follows: DIP (depend on abstraction, not concrete implementations)

export const PaymentStrategies = {
  card: {
    name: 'Card',
    process: (amount) => {
      console.log(`Processing card payment of $${amount}`);
      return { success: true, method: 'card', amount };
    }
  },
  paypal: {
    name: 'PayPal',
    process: (amount) => {
      console.log(`Processing PayPal payment of $${amount}`);
      return { success: true, method: 'paypal', amount };
    }
  },
  cod: {
    name: 'Cash on Delivery',
    process: (amount) => {
      console.log(`Processing cash on delivery payment of $${amount}`);
      return { success: true, method: 'cod', amount };
    }
  }
};

export function processPayment(method, amount) {
  const strategy = PaymentStrategies[method];
  
  if (!strategy) {
    return { success: false, error: `Unknown payment method: ${method}` };
  }
  
  return strategy.process(amount);
}

export function getAvailablePaymentMethods() {
  return Object.keys(PaymentStrategies);
}
