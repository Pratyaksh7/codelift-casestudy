import type { OrderStatus } from '../../components/StatusBadge/StatusBadge';
import { client } from '../client';
import { endpoints } from '../endpoints';

export type Order = {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: OrderStatus;
  date: string;
};

export function fetchOrders(signal?: AbortSignal): Promise<Order[]> {
  return client.get<Order[]>(endpoints.orders.list, { signal });
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<Order> {
  return client.patch<Order>(endpoints.orders.byId(orderId), { status });
}
