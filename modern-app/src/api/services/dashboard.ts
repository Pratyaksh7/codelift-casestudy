import { client } from '../client';
import { endpoints } from '../endpoints';

export type OrderStatus = 'completed' | 'processing' | 'shipped' | 'pending' | 'cancelled';

export type DashboardStats = {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
};

export type DashboardRecentOrder = {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
  date: string;
};

export type DashboardStatsResponse = {
  stats: DashboardStats;
  recentOrders: DashboardRecentOrder[];
};

export function fetchDashboardStats(signal?: AbortSignal): Promise<DashboardStatsResponse> {
  return client.get<DashboardStatsResponse>(endpoints.dashboard.stats, { signal });
}
