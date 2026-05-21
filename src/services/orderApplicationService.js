import { Order } from "../domain/Order";
import { PricingService } from "../domain/PricingService";

export class OrderApplicationService {
  constructor({ repository, paymentService, notificationService }) {
    this.repository = repository;
    this.paymentService = paymentService;
    this.notificationService = notificationService;
  }

  placeOrder({ user, item, qty, payment }) {
    const total = PricingService.calculateOrderTotal({ user, item, qty });
    this.paymentService.authorize(payment);

    const order = Order.create({ user, item, qty, total });
    const orders = this.repository.addOrder(order);

    this.notificationService.notifyOrderCreated(user, order.id);

    return {
      order,
      orders,
      message: `Order ${order.id} placed. Total: ${order.total}`,
    };
  }

  refundOrder(orderId) {
    const orders = this.repository.refundOrder(orderId);
    return {
      orders,
      message: `Refund attempted for ${orderId}`,
    };
  }

  exportReport() {
    const orders = this.repository.loadOrders();
    let revenue = 0;
    const lines = ["id,user,item,qty,total,status"];

    orders.forEach((order) => {
      if (!order.isRefunded()) revenue += order.total;
      lines.push(order.toCsvLine());
    });

    return {
      csv: lines.join("\n"),
      revenue,
    };
  }
}
