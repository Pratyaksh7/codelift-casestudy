import { useCallback, useState } from 'react';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import type { BreadcrumbItem } from '../../components/Breadcrumb/Breadcrumb';
import { ConfirmDialog } from '../../components/ConfirmDialog/ConfirmDialog';
import { InventoryAlert } from '../../components/InventoryAlert/InventoryAlert';
import { InventoryTable } from '../../components/InventoryTable/InventoryTable';
import { InventoryToolbar } from '../../components/InventoryToolbar/InventoryToolbar';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { RestockModal } from '../../components/RestockModal/RestockModal';
import { useInventory } from '../../hooks/useInventory';
import type { BulkAction } from './types';
import './Inventory.css';

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Inventory' },
];

function Inventory() {
  const {
    loading,
    error,
    filteredInventory,
    lowStockCount,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    warehouseFilter,
    setWarehouseFilter,
    sortBy,
    sortDir,
    handleSort,
    selectedItems,
    selectAll,
    toggleSelectAll,
    toggleSelectItem,
    applyBulkStatus,
    restockItem,
  } = useInventory();

  const [restockItemId, setRestockItemId] = useState<number | null>(null);
  const [pendingBulkAction, setPendingBulkAction] = useState<BulkAction | null>(
    null,
  );

  const openRestockModal = useCallback((itemId: number) => {
    setRestockItemId(itemId);
  }, []);

  const closeRestockModal = useCallback(() => {
    setRestockItemId(null);
  }, []);

  const handleRestockConfirm = useCallback(
    (qty: number) => {
      if (restockItemId !== null) {
        void restockItem(restockItemId, qty);
      }
      closeRestockModal();
    },
    [restockItemId, restockItem, closeRestockModal],
  );

  const requestBulkAction = useCallback(
    (action: BulkAction) => {
      if (selectedItems.length === 0) {
        alert('Please select at least one item');
        return;
      }
      setPendingBulkAction(action);
    },
    [selectedItems.length],
  );

  const confirmBulkAction = useCallback(() => {
    if (pendingBulkAction) applyBulkStatus(pendingBulkAction);
    setPendingBulkAction(null);
  }, [pendingBulkAction, applyBulkStatus]);

  const cancelBulkAction = useCallback(() => {
    setPendingBulkAction(null);
  }, []);

  return (
    <div className="inventory-page">
      <Breadcrumb items={BREADCRUMB_ITEMS} />

      <div className="inventory-page__header">
        <h2>Inventory Management</h2>
        <p className="inventory-page__subtitle">
          Track and manage your product stock levels
        </p>
      </div>

      {error ? (
        <div className="inventory-page__error-banner" role="alert">
          {error}
        </div>
      ) : null}

      <InventoryAlert lowStockCount={lowStockCount} />

      <InventoryToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        warehouseFilter={warehouseFilter}
        onWarehouseFilterChange={setWarehouseFilter}
        selectedCount={selectedItems.length}
        onBulkAction={requestBulkAction}
      />

      {loading ? (
        <LoadingSpinner message="Loading inventory..." />
      ) : (
        <InventoryTable
          items={filteredInventory}
          selectedItems={selectedItems}
          selectAll={selectAll}
          sortBy={sortBy}
          sortDir={sortDir}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectItem={toggleSelectItem}
          onSort={handleSort}
          onRestockClick={openRestockModal}
        />
      )}

      {restockItemId !== null && (
        <RestockModal
          onClose={closeRestockModal}
          onConfirm={handleRestockConfirm}
        />
      )}

      <ConfirmDialog
        open={pendingBulkAction !== null}
        title="Bulk Action"
        message={`Are you sure you want to update ${selectedItems.length} items?`}
        onConfirm={confirmBulkAction}
        onCancel={cancelBulkAction}
      />
    </div>
  );
}

export default Inventory;
