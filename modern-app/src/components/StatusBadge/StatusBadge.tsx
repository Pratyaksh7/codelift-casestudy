import './StatusBadge.css';

export type OrderStatus =
  | 'completed'
  | 'processing'
  | 'shipped'
  | 'pending'
  | 'cancelled';

const STATUS_COLORS: Record<OrderStatus, string> = {
  completed: '#27ae60',
  processing: '#f39c12',
  shipped: '#3498db',
  pending: '#95a5a6',
  cancelled: '#e74c3c',
};

export type StatusBadgeProps = {
  status: OrderStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className="dashboard__status-badge"
      style={{ backgroundColor: STATUS_COLORS[status] ?? STATUS_COLORS.pending }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
