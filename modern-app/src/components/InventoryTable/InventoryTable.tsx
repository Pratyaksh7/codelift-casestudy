import { InventoryStatusPill } from '../InventoryStatusPill/InventoryStatusPill';
import { formatDate } from '../../utils/dateUtils';
import type {
  InventoryItem,
  SortBy,
  SortDir,
} from '../../pages/Inventory/types';

export type InventoryTableProps = {
  items: InventoryItem[];
  selectedItems: number[];
  selectAll: boolean;
  sortBy: SortBy;
  sortDir: SortDir;
  onToggleSelectAll: () => void;
  onToggleSelectItem: (itemId: number) => void;
  onSort: (column: SortBy) => void;
  onRestockClick: (itemId: number) => void;
};

function getSortIndicator(
  column: SortBy,
  sortBy: SortBy,
  sortDir: SortDir,
): string {
  if (sortBy !== column) return '';
  return sortDir === 'asc' ? '\u25B2' : '\u25BC';
}

export function InventoryTable({
  items,
  selectedItems,
  selectAll,
  sortBy,
  sortDir,
  onToggleSelectAll,
  onToggleSelectItem,
  onSort,
  onRestockClick,
}: InventoryTableProps) {
  return (
    <div className="inventory-page__table-wrap">
      <table className="inventory-page__table">
        <thead>
          <tr>
            <th className="inventory-page__th inventory-page__th--checkbox">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={onToggleSelectAll}
              />
            </th>
            <th
              className="inventory-page__th inventory-page__th--sortable"
              onClick={() => onSort('productName')}
            >
              Product {getSortIndicator('productName', sortBy, sortDir)}
            </th>
            <th className="inventory-page__th">SKU</th>
            <th
              className="inventory-page__th inventory-page__th--sortable"
              onClick={() => onSort('quantity')}
            >
              Qty {getSortIndicator('quantity', sortBy, sortDir)}
            </th>
            <th className="inventory-page__th">Reorder Level</th>
            <th className="inventory-page__th">Status</th>
            <th className="inventory-page__th">Warehouse</th>
            <th className="inventory-page__th">Last Restocked</th>
            <th className="inventory-page__th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={9} className="inventory-page__empty">
                No inventory items found.
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              const isLow = item.quantity <= item.reorderLevel;
              return (
                <tr
                  key={item.id}
                  className={
                    isSelected ? 'inventory-page__row--selected' : ''
                  }
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectItem(item.id)}
                    />
                  </td>
                  <td className="inventory-page__product-name">
                    {item.productName}
                  </td>
                  <td className="inventory-page__sku">{item.sku}</td>
                  <td>
                    <span
                      className={
                        'inventory-page__qty' +
                        (isLow ? ' inventory-page__qty--low' : '')
                      }
                    >
                      {item.quantity}
                    </span>
                  </td>
                  <td className="inventory-page__reorder">
                    {item.reorderLevel}
                  </td>
                  <td>
                    <InventoryStatusPill status={item.status} />
                  </td>
                  <td>{item.warehouse}</td>
                  <td className="inventory-page__date">
                    {formatDate(item.lastRestocked)}
                  </td>
                  <td>
                    <button
                      className="inventory-page__btn inventory-page__btn--success"
                      onClick={() => onRestockClick(item.id)}
                    >
                      Restock
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;
