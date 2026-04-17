import type { CSSProperties } from 'react';
import './UserStatusBadge.css';

export type UserStatusKey =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'completed'
  | 'processing'
  | 'shipped'
  | 'cancelled'
  | 'expired'
  | 'scheduled'
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock'
  | 'discontinued'
  | 'admin'
  | 'manager'
  | 'editor'
  | 'viewer';

export type UserStatusBadgeSize = 'small' | 'normal';
export type UserStatusBadgeVariant = 'filled' | 'outline';

export type UserStatusBadgeProps = {
  status: UserStatusKey | (string & {});
  label?: string;
  size?: UserStatusBadgeSize;
  variant?: UserStatusBadgeVariant;
  colorMap?: Record<string, string>;
};

const DEFAULT_COLORS: Record<string, string> = {
  active: '#27ae60',
  inactive: '#95a5a6',
  pending: '#f39c12',
  completed: '#27ae60',
  processing: '#f39c12',
  shipped: '#3498db',
  cancelled: '#e74c3c',
  expired: '#e74c3c',
  scheduled: '#9b59b6',
  in_stock: '#27ae60',
  low_stock: '#f39c12',
  out_of_stock: '#e74c3c',
  discontinued: '#95a5a6',
  admin: '#e74c3c',
  manager: '#3498db',
  editor: '#f39c12',
  viewer: '#95a5a6',
};

function getColor(status: string, colorMap?: Record<string, string>): string {
  if (colorMap && colorMap[status]) return colorMap[status];
  return DEFAULT_COLORS[status] ?? '#95a5a6';
}

function formatLabel(status: string, label?: string): string {
  if (label) return label;
  if (!status) return '';
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export function UserStatusBadge({
  status,
  label,
  size = 'normal',
  variant = 'filled',
  colorMap,
}: UserStatusBadgeProps) {
  const color = getColor(status, colorMap);
  const text = formatLabel(status, label);

  const style: CSSProperties =
    variant === 'outline'
      ? { border: `1px solid ${color}`, color, backgroundColor: 'transparent' }
      : { backgroundColor: color, color: '#fff' };

  const className = `user-status-badge${size === 'small' ? ' user-status-badge--small' : ''}`;

  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
}

export default UserStatusBadge;
