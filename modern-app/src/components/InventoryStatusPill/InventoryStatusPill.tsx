import type { InventoryStatus } from '../../pages/Inventory/types';

const STATUS_COLOR: Record<InventoryStatus, string> = {
  in_stock: '#27ae60',
  low_stock: '#f39c12',
  out_of_stock: '#e74c3c',
};

function formatStatusLabel(status: InventoryStatus): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export type InventoryStatusPillProps = {
  status: InventoryStatus;
};

export function InventoryStatusPill({ status }: InventoryStatusPillProps) {
  return (
    <span
      className="inventory-page__badge"
      style={{ backgroundColor: STATUS_COLOR[status] }}
    >
      {formatStatusLabel(status)}
    </span>
  );
}

export default InventoryStatusPill;
