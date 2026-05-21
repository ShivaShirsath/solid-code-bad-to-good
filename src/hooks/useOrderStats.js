import { useMemo } from "react";
import { calculateRevenue } from "../services/reporting";

export function useOrderStats(orders) {
  const stats = useMemo(() => ({
    totalOrders: orders.length,
    activeOrders: orders.filter(o => o.status !== "REFUNDED").length,
    revenue: calculateRevenue(orders).toFixed(2)
  }), [orders]);

  return stats;
}
