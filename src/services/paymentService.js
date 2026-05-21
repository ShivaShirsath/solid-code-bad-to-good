export class PaymentService {
  constructor(processorsByType) {
    this.processorsByType = processorsByType;
  }

  async process(paymentType, payload) {
    const processor = this.processorsByType[paymentType];
    if (!processor) {
      throw new Error(`Unsupported payment type: ${paymentType}`);
    }

    return processor.pay(payload);
  }
}
