import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../api/client';
import {
  createCoupon as createCouponRequest,
  deleteCoupon as deleteCouponRequest,
  fetchCoupons,
  toggleCouponStatus as toggleCouponStatusRequest,
  updateCoupon as updateCouponRequest,
} from '../api/services/coupons';
import {
  mockCoupons,
  type Coupon,
  type CouponStatus,
  type CouponType,
} from '../pages/Coupons/mockCoupons';

export type { Coupon, CouponStatus, CouponType };

export type StatusFilter = 'all' | CouponStatus;

export type CouponFormData = {
  code: string;
  type: CouponType;
  value: string;
  minPurchase: string;
  maxUses: string;
  startDate: string;
  endDate: string;
  description: string;
  status: CouponStatus;
};

export type CouponFormErrors = Partial<Record<keyof CouponFormData, string>>;

export const EMPTY_COUPON_FORM: CouponFormData = {
  code: '',
  type: 'percentage',
  value: '',
  minPurchase: '',
  maxUses: '',
  startDate: '',
  endDate: '',
  description: '',
  status: 'active',
};

export type UseCouponsResult = {
  coupons: Coupon[];
  filteredCoupons: Coupon[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  createCoupon: (data: CouponFormData) => Promise<void>;
  updateCoupon: (id: number, data: CouponFormData) => Promise<void>;
  deleteCoupon: (id: number) => Promise<void>;
  toggleCouponStatus: (coupon: Coupon) => Promise<void>;
};

function formDataToPayload(
  data: CouponFormData,
): Omit<Coupon, 'id' | 'usedCount'> {
  return {
    code: data.code.toUpperCase(),
    type: data.type,
    value: parseFloat(data.value) || 0,
    minPurchase: parseFloat(data.minPurchase) || 0,
    maxUses: data.maxUses ? parseInt(data.maxUses, 10) : null,
    startDate: new Date(data.startDate).toISOString(),
    endDate: new Date(data.endDate).toISOString(),
    description: data.description,
    status: data.status,
  };
}

function messageFrom(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export function useCoupons(): UseCouponsResult {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const list = await fetchCoupons(controller.signal);
        if (!cancelled) {
          setCoupons(list);
          setError(null);
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        // Legacy couponActions falls back to in-file mockCoupons on failure.
        setCoupons(mockCoupons);
        setError(messageFrom(err, 'Failed to load coupons'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const filteredCoupons = useMemo(() => {
    let list = coupons;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          c.code.toLowerCase().includes(term) ||
          (c.description || '').toLowerCase().includes(term),
      );
    }
    if (statusFilter !== 'all') {
      list = list.filter((c) => c.status === statusFilter);
    }
    return list;
  }, [coupons, searchTerm, statusFilter]);

  const createCoupon = useCallback(async (data: CouponFormData) => {
    const payload = formDataToPayload(data);
    try {
      const created = await createCouponRequest(payload);
      setCoupons((prev) => [...prev, created]);
      setError(null);
    } catch (err) {
      setError(messageFrom(err, 'Failed to create coupon'));
      throw err;
    }
  }, []);

  const updateCoupon = useCallback(
    async (id: number, data: CouponFormData) => {
      const payload = formDataToPayload(data);
      try {
        const updated = await updateCouponRequest(id, payload);
        setCoupons((prev) => prev.map((c) => (c.id === id ? updated : c)));
        setError(null);
      } catch (err) {
        setError(messageFrom(err, 'Failed to update coupon'));
        throw err;
      }
    },
    [],
  );

  const deleteCoupon = useCallback(async (id: number) => {
    try {
      await deleteCouponRequest(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      setError(null);
    } catch (err) {
      setError(messageFrom(err, 'Failed to delete coupon'));
      throw err;
    }
  }, []);

  const toggleCouponStatus = useCallback(async (coupon: Coupon) => {
    const nextStatus: CouponStatus =
      coupon.status === 'active' ? 'inactive' : 'active';
    // Optimistic flip to match legacy dispatching TOGGLE_COUPON_STATUS immediately.
    setCoupons((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, status: nextStatus } : c)),
    );
    try {
      const updated = await toggleCouponStatusRequest(coupon.id, nextStatus);
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? updated : c)));
      setError(null);
    } catch (err) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, status: coupon.status } : c)),
      );
      setError(messageFrom(err, 'Failed to toggle coupon status'));
    }
  }, []);

  return {
    coupons,
    filteredCoupons,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
  };
}

export default useCoupons;
