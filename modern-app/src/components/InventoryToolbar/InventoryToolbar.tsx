import type { ChangeEvent } from 'react';
import type {
  BulkAction,
  StatusFilter,
  WarehouseFilter,
} from '../../pages/Inventory/types';

export type InventoryToolbarProps = {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  warehouseFilter: WarehouseFilter;
  onWarehouseFilterChange: (warehouse: WarehouseFilter) => void;
  selectedCount: number;
  onBulkAction: (action: BulkAction) => void;
};

export function InventoryToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  warehouseFilter,
  onWarehouseFilterChange,
  selectedCount,
  onBulkAction,
}: InventoryToolbarProps) {
  return (
    <div className="inventory-page__toolbar">
      <div className="inventory-page__toolbar-left">
        <input
          type="text"
          className="inventory-page__search"
          placeholder="Search by name or SKU..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
        />
        <select
          className="inventory-page__filter-select"
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as StatusFilter)
          }
        >
          <option value="all">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <select
          className="inventory-page__filter-select"
          value={warehouseFilter}
          onChange={(e) =>
            onWarehouseFilterChange(e.target.value as WarehouseFilter)
          }
        >
          <option value="all">All Warehouses</option>
          <option value="Main">Main</option>
          <option value="Secondary">Secondary</option>
        </select>
      </div>
      <div className="inventory-page__toolbar-right">
        {selectedCount > 0 && (
          <div className="inventory-page__bulk-actions">
            <span className="inventory-page__bulk-count">
              {selectedCount} selected
            </span>
            <button
              className="inventory-page__btn inventory-page__btn--primary"
              onClick={() => onBulkAction('markInStock')}
            >
              Mark In Stock
            </button>
            <button
              className="inventory-page__btn inventory-page__btn--warn"
              onClick={() => onBulkAction('markLowStock')}
            >
              Mark Low Stock
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryToolbar;
