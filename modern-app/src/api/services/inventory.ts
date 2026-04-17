import type {
  InventoryItem,
  InventoryStatus,
} from '../../pages/Inventory/types';
import { client } from '../client';
import { endpoints } from '../endpoints';

export type InventoryBulkItem = { id: number; status: InventoryStatus };

export function fetchInventory(signal?: AbortSignal): Promise<InventoryItem[]> {
  return client.get<InventoryItem[]>(endpoints.inventory.list, { signal });
}

export function updateInventoryItem(
  id: number,
  patch: Partial<InventoryItem>,
): Promise<InventoryItem> {
  return client.put<InventoryItem>(endpoints.inventory.byId(id), patch);
}

export function bulkUpdateInventory(
  items: InventoryBulkItem[],
): Promise<InventoryItem[]> {
  return client.post<InventoryItem[]>(endpoints.inventory.bulkUpdate, { items });
}

export function restockItem(
  id: number,
  quantity: number,
): Promise<InventoryItem> {
  return client.post<InventoryItem>(endpoints.inventory.restock(id), { quantity });
}
