import React from "react";

export default function StatsBar({ stats }) {
  return (
    <div className="card" style={{ display: "flex", justifyContent: "space-around", fontSize: "14px" }}>
      <span>📦 Total Orders: {stats.totalOrders}</span>
      <span>✓ Active: {stats.activeOrders}</span>
      <span>💰 Revenue: ${stats.revenue}</span>
    </div>
  );
}
