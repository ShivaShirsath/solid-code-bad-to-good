import { getItemPrice } from "../domain/catalog";

export class OrderAppService {
  constructor({ orderRepository, discountPolicy, orderFactory, paymentService, notificationService, reportService }) {
    this.orderRepository = orderRepository;
    this.discountPolicy = discountPolicy;
    this.orderFactory = orderFactory;
    this.paymentService = paymentService;
    this.notificationService = notificationService;
    this.reportService = reportService;
  }

  loadOrders() {
    return this.orderRepository.getAll();
  }

  async placeOrder({ user, item, qty, payment }) {
    const price = getItemPrice(item);
    const subtotal = price * qty;
    const total = this.discountPolicy.apply({ user, qty, subtotal });

    await this.paymentService.process(payment, { user, item, qty, total });

    const order = this.orderFactory.create({ user, item, qty, total });
    const orders = [...this.orderRepository.getAll(), order];
    this.orderRepository.saveAll(orders);

    await this.notificationService.notifyOrderPlaced({ user, orderId: order.id });

    return {
      order,
      orders,
      message: `Order ${order.id} placed. Total: ${total}`
    };
  }

  refundOrder(orderId) {
    const orders = this.orderRepository.getAll();
    const next = orders.map((o) => {
      if (o.id === orderId && o.status !== "REFUNDED") {
        return { ...o, status: "REFUNDED" };
      }
      return o;
    });

    this.orderRepository.saveAll(next);

    return {
      orders: next,
      message: `Refund attempted for ${orderId}`
    };
  }

  exportOrdersReport() {
    const orders = this.orderRepository.getAll();
    this.reportService.exportCsv(orders);
    const revenue = this.reportService.buildRevenue(orders);

    return {
      message: `Revenue: ${revenue}`
    };
  }
}
