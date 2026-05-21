import React, { useMemo } from "react";

/**
 * Renders real-time business statistics cards.
 * 
 * @param {Object} props
 * @param {Array} props.orders - List of orders to compute metrics from
 */
export default function DashboardStats({ orders = [] }) {
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let refundedVolume = 0;
    let activeOrdersCount = 0;
    let refundedOrdersCount = 0;

    orders.forEach(order => {
      if (order.status === "REFUNDED") {
        refundedVolume += order.total;
        refundedOrdersCount += 1;
      } else {
        totalRevenue += order.total;
        activeOrdersCount += 1;
      }
    });

    const averageOrderValue = activeOrdersCount > 0 ? totalRevenue / activeOrdersCount : 0;

    return {
      revenue: totalRevenue,
      refunded: refundedVolume,
      activeCount: activeOrdersCount,
      refundedCount: refundedOrdersCount,
      aov: averageOrderValue
    };
  }, [orders]);

  return (
    <div className="stats-grid">
      {/* Revenue Card */}
      <div className="stat-card revenue">
        <div className="stat-header">
          <span className="stat-title">Net Revenue</span>
          <span className="stat-badge success">Live</span>
        </div>
        <div className="stat-value">${stats.revenue.toFixed(2)}</div>
        <div className="stat-footer">
          Excluding refunded transactions
        </div>
      </div>

      {/* Orders Count Card */}
      <div className="stat-card orders">
        <div className="stat-header">
          <span className="stat-title">Active Orders</span>
          <span className="stat-badge primary">Volume</span>
        </div>
        <div className="stat-value">{stats.activeCount}</div>
        <div className="stat-footer">
          {stats.refundedCount} refunded orders logged
        </div>
      </div>

      {/* Average Order Value (AOV) Card */}
      <div className="stat-card aov">
        <div className="stat-header">
          <span className="stat-title">Avg Order Value</span>
          <span className="stat-badge info">AOV</span>
        </div>
        <div className="stat-value">${stats.aov.toFixed(2)}</div>
        <div className="stat-footer">
          Average spending per ticket
        </div>
      </div>

      {/* Refunded Volume Card */}
      <div className="stat-card refunds">
        <div className="stat-header">
          <span className="stat-title">Refunded Value</span>
          <span className="stat-badge danger">Loss</span>
        </div>
        <div className="stat-value">${stats.refunded.toFixed(2)}</div>
        <div className="stat-footer">
          Capital returned to customers
        </div>
      </div>
    </div>
  );
}
