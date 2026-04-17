import { useEffect, useState } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import type { OrderStatus } from '../../api/services/dashboard';
import './Dashboard.css';

const STATUS_COLORS: Record<OrderStatus, string> = {
  completed: '#27ae60',
  processing: '#f39c12',
  shipped: '#3498db',
  pending: '#95a5a6',
  cancelled: '#e74c3c',
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

function formatOrderDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className="dashboard__status-badge"
      style={{ backgroundColor: STATUS_COLORS[status] ?? STATUS_COLORS.pending }}
    >
      {status}
    </span>
  );
}

// Small counter effect that mirrors the legacy jQuery animation (0 -> target over 1000ms)
function useCountUp(target: number, durationMs = 1000): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / durationMs, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

type StatCardProps = {
  label: string;
  value: number;
  iconBg: string;
  icon: string;
  prefix?: string;
};

function StatCard({ label, value, iconBg, icon, prefix }: StatCardProps) {
  const animated = useCountUp(value);
  return (
    <div className="dashboard__stat-card">
      <div className="dashboard__stat-icon" style={{ backgroundColor: iconBg }}>
        <span>{icon}</span>
      </div>
      <div className="dashboard__stat-info">
        <p className="dashboard__stat-label">{label}</p>
        <h3 className="dashboard__stat-number">
          {prefix ?? ''}
          {animated.toLocaleString()}
        </h3>
      </div>
    </div>
  );
}

function Dashboard() {
  const { data, loading, error } = useDashboard();

  if (loading || !data) {
    return (
      <div className="dashboard__loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const { stats, recentOrders } = data;

  return (
    <div className="dashboard">
      <div className="dashboard__page-header">
        <h2>Dashboard</h2>
        <p className="dashboard__page-subtitle">Welcome back! Here's what's happening today.</p>
      </div>

      {error ? (
        <div className="dashboard__error-banner" role="alert">
          Could not load live data ({error}). Showing cached sample.
        </div>
      ) : null}

      <div className="dashboard__stats-grid">
        <StatCard label="Total Sales" value={stats.totalSales} iconBg="#ebf5fb" icon="\u{1F4B0}" prefix="$" />
        <StatCard label="Total Orders" value={stats.totalOrders} iconBg="#fef9e7" icon="\u{1F4E6}" />
        <StatCard label="Products" value={stats.totalProducts} iconBg="#eafaf1" icon="\u{1F6D2}" />
        <StatCard label="Customers" value={stats.totalCustomers} iconBg="#f5eef8" icon="\u{1F465}" />
      </div>

      <div className="dashboard__section">
        <h3 className="dashboard__section-title">Recent Orders</h3>
        <div className="dashboard__table-wrap">
          <table className="dashboard__table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="dashboard__order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="dashboard__order-date">{formatOrderDate(order.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
