import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../api/client';
import {
  bulkUpdateInventory,
  fetchInventory,
  restockItem as restockItemRequest,
  type InventoryBulkItem,
} from '../api/services/inventory';
import { MOCK_INVENTORY } from '../pages/Inventory/mockInventory';
import type {
  BulkAction,
  InventoryItem,
  InventoryStatus,
  SortBy,
  SortDir,
  StatusFilter,
  WarehouseFilter,
} from '../pages/Inventory/types';

function messageFrom(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

function compareItems(
  a: InventoryItem,
  b: InventoryItem,
  sortBy: SortBy,
  sortDir: SortDir,
): number {
  const rawA = a[sortBy];
  const rawB = b[sortBy];
  let cmp: number;
  if (typeof rawA === 'string' && typeof rawB === 'string') {
    cmp = rawA.toLowerCase() > rawB.toLowerCase() ? 1 : -1;
  } else if (typeof rawA === 'number' && typeof rawB === 'number') {
    cmp = rawA > rawB ? 1 : -1;
  } else {
    cmp = 0;
  }
  return sortDir === 'asc' ? cmp : -cmp;
}

export type UseInventoryResult = {
  loading: boolean;
  error: string | null;
  filteredInventory: InventoryItem[];
  lowStockCount: number;

  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  warehouseFilter: WarehouseFilter;
  setWarehouseFilter: (warehouse: WarehouseFilter) => void;

  sortBy: SortBy;
  sortDir: SortDir;
  handleSort: (column: SortBy) => void;

  selectedItems: number[];
  selectAll: boolean;
  toggleSelectAll: () => void;
  toggleSelectItem: (itemId: number) => void;
  clearSelection: () => void;

  applyBulkStatus: (action: BulkAction) => Promise<void>;
  restockItem: (itemId: number, quantity: number) => Promise<void>;
};

export function useInventory(): UseInventoryResult {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<WarehouseFilter>('all');

  const [sortBy, setSortBy] = useState<SortBy>('productName');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const list = await fetchInventory(controller.signal);
        if (!cancelled) {
          setInventory(list);
          setError(null);
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        // Legacy inventoryActions falls back to mockInventory on API failure.
        setInventory(MOCK_INVENTORY);
        setError(messageFrom(err, 'Failed to load inventory'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const filteredInventory = useMemo(() => {
    let items = inventory;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (i) =>
          i.productName.toLowerCase().includes(term) ||
          i.sku.toLowerCase().includes(term),
      );
    }

    if (statusFilter !== 'all') {
      items = items.filter((i) => i.status === statusFilter);
    }

    if (warehouseFilter !== 'all') {
      items = items.filter((i) => i.warehouse === warehouseFilter);
    }

    return items.slice().sort((a, b) => compareItems(a, b, sortBy, sortDir));
  }, [inventory, searchTerm, statusFilter, warehouseFilter, sortBy, sortDir]);

  const lowStockCount = useMemo(
    () =>
      inventory.filter(
        (i) => i.status === 'low_stock' || i.status === 'out_of_stock',
      ).length,
    [inventory],
  );

  const handleSort = useCallback(
    (column: SortBy) => {
      if (sortBy === column) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(column);
        setSortDir('asc');
      }
    },
    [sortBy],
  );

  const toggleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectAll(false);
      setSelectedItems([]);
    } else {
      setSelectAll(true);
      setSelectedItems(filteredInventory.map((i) => i.id));
    }
  }, [selectAll, filteredInventory]);

  const toggleSelectItem = useCallback((itemId: number) => {
    setSelectedItems((prev) => {
      const idx = prev.indexOf(itemId);
      if (idx !== -1) {
        const next = prev.slice();
        next.splice(idx, 1);
        return next;
      }
      return [...prev, itemId];
    });
    setSelectAll(false);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, []);

  const applyBulkStatus = useCallback(
    async (action: BulkAction) => {
      const nextStatus: InventoryStatus =
        action === 'markInStock' ? 'in_stock' : 'low_stock';
      const payload: InventoryBulkItem[] = selectedItems.map((id) => ({
        id,
        status: nextStatus,
      }));
      // Legacy optimistically updates local state regardless of API outcome.
      setInventory((prev) =>
        prev.map((i) =>
          selectedItems.includes(i.id) ? { ...i, status: nextStatus } : i,
        ),
      );
      setSelectedItems([]);
      setSelectAll(false);
      try {
        await bulkUpdateInventory(payload);
        setError(null);
      } catch (err) {
        setError(messageFrom(err, 'Failed to apply bulk update'));
      }
    },
    [selectedItems],
  );

  const restockItem = useCallback(
    async (itemId: number, quantity: number) => {
      // Legacy restockItem adds to local quantity even when the API rejects.
      setInventory((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? {
                ...i,
                quantity: i.quantity + quantity,
                lastRestocked: new Date().toISOString(),
                status: i.quantity + quantity > i.reorderLevel ? 'in_stock' : i.status,
              }
            : i,
        ),
      );
      try {
        const updated = await restockItemRequest(itemId, quantity);
        setInventory((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
        setError(null);
      } catch (err) {
        setError(messageFrom(err, 'Failed to restock item'));
      }
    },
    [],
  );

  return {
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
    clearSelection,

    applyBulkStatus,
    restockItem,
  };
}

export default useInventory;
