export class PaymentProcessor {
  execute() {
    throw new Error("PaymentProcessor.execute() must be implemented by subclasses");
  }
}

export class CardPaymentProcessor extends PaymentProcessor {
  execute() {
    console.log("Processing payment through card gateway");
  }
}

export class PaypalPaymentProcessor extends PaymentProcessor {
  execute() {
    console.log("Processing payment through PayPal API");
  }
}

export class CashOnDeliveryProcessor extends PaymentProcessor {
  execute() {
    console.log("Payment will be collected on delivery");
  }
}

export class PaymentService {
  constructor(processors) {
    this.processors = processors;
  }

  authorize(paymentMethod) {
    const processor = this.processors[paymentMethod];
    if (!processor) {
      throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
    processor.execute();
  }
}
