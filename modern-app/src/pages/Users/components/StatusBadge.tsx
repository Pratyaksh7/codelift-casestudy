import type { CSSProperties } from 'react';

type Props = {
  status: string;
  label?: string;
  size?: 'small' | 'normal';
  variant?: 'filled' | 'outline';
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

export function StatusBadge({
  status,
  label,
  size = 'normal',
  variant = 'filled',
  colorMap,
}: Props) {
  const color = getColor(status, colorMap);
  const labelText = formatLabel(status, label);

  const baseStyle: CSSProperties = {
    display: 'inline-block',
    padding: size === 'small' ? '2px 8px' : '4px 12px',
    borderRadius: 12,
    fontSize: size === 'small' ? 11 : 12,
    fontWeight: 500,
    textTransform: 'capitalize',
    lineHeight: 1.5,
  };

  if (variant === 'outline') {
    baseStyle.border = `1px solid ${color}`;
    baseStyle.color = color;
    baseStyle.backgroundColor = 'transparent';
  } else {
    baseStyle.backgroundColor = color;
    baseStyle.color = 'white';
  }

  return <span style={baseStyle}>{labelText}</span>;
}

export default StatusBadge;
