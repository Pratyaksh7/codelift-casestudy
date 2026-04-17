import { useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import {
  fetchDashboardStats,
  type DashboardStatsResponse,
} from '../api/services/dashboard';

// Legacy Dashboard.js fell back to inline mock data on any fetch failure — preserved here
// so the UX matches (stats grid still renders something instead of an empty error screen).
const MOCK_FALLBACK: DashboardStatsResponse = {
  stats: {
    totalSales: 124750,
    totalOrders: 356,
    totalProducts: 89,
    totalCustomers: 1240,
  },
  recentOrders: [
    { id: 'ORD-1024', customer: 'John Doe', total: 299.99, status: 'completed', date: '2022-01-15T10:30:00Z' },
    { id: 'ORD-1023', customer: 'Jane Smith', total: 149.5, status: 'processing', date: '2022-01-15T09:15:00Z' },
    { id: 'ORD-1022', customer: 'Bob Johnson', total: 89.99, status: 'shipped', date: '2022-01-14T16:45:00Z' },
    { id: 'ORD-1021', customer: 'Alice Brown', total: 450.0, status: 'completed', date: '2022-01-14T14:20:00Z' },
    { id: 'ORD-1020', customer: 'Charlie Wilson', total: 67.25, status: 'pending', date: '2022-01-14T11:00:00Z' },
  ],
};

export type UseDashboardResult = {
  data: DashboardStatsResponse | null;
  loading: boolean;
  error: string | null;
};

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const response = await fetchDashboardStats(controller.signal);
        if (!cancelled) {
          setData(response);
          setError(null);
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        const message = err instanceof ApiError ? err.message : 'Failed to load dashboard';
        setData(MOCK_FALLBACK);
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return { data, loading, error };
}

export default useDashboard;
