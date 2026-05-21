import { Order } from "../../models/Order";

export function createOrder(data) {
  return new Order(data);
}