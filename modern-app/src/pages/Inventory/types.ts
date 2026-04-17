export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type WarehouseFilter = 'all' | 'Main' | 'Secondary';

export type StatusFilter = 'all' | InventoryStatus;

export type SortBy = 'productName' | 'quantity';

export type SortDir = 'asc' | 'desc';

export type BulkAction = 'markInStock' | 'markLowStock';

export type InventoryItem = {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  reorderLevel: number;
  warehouse: 'Main' | 'Secondary';
  lastRestocked: string;
  status: InventoryStatus;
};
