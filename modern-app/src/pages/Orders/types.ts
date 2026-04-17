import type { OrderStatus } from '../../components/StatusBadge/StatusBadge';

export type Order = {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: OrderStatus;
  date: string;
};

export type FilterStatus = 'all' | OrderStatus;

export type SortBy = 'date' | 'total' | 'id';

export type SortDir = 'asc' | 'desc';
