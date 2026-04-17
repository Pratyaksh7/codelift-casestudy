import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import {
  fetchOrders,
  updateOrderStatus as updateOrderStatusRequest,
  type Order,
} from '../api/services/orders';
import type { OrderStatus } from '../components/StatusBadge/StatusBadge';
import { MOCK_ORDERS } from '../pages/Orders/mockOrders';

export type { Order } from '../api/services/orders';

export type UseOrdersResult = {
  orders: Order[];
  loading: boolean;
  error: string | null;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
};

function messageFrom(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export function useOrders(): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const list = await fetchOrders(controller.signal);
        if (!cancelled) {
          setOrders(list);
          setError(null);
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        // Legacy orderActions.fetchOrders falls back to in-file mockOrders on network error.
        setOrders(MOCK_ORDERS);
        setError(messageFrom(err, 'Failed to load orders'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const updateStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      // Legacy thunk dispatches optimistic UPDATE_ORDER_STATUS then syncs via PATCH —
      // mirror that by flipping local state first and rolling back on failure.
      let previous: OrderStatus | null = null;
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o;
          previous = o.status;
          return { ...o, status };
        }),
      );
      try {
        await updateOrderStatusRequest(orderId, status);
        setError(null);
      } catch (err) {
        if (previous !== null) {
          const rollback: OrderStatus = previous;
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: rollback } : o)),
          );
        }
        setError(messageFrom(err, 'Failed to update order status'));
      }
    },
    [],
  );

  return { orders, loading, error, updateStatus };
}

export default useOrders;
