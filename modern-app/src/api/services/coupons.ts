import type { Coupon, CouponStatus } from '../../pages/Coupons/mockCoupons';
import { client } from '../client';
import { endpoints } from '../endpoints';

export type CouponPayload = Omit<Coupon, 'id' | 'usedCount'>;

export function fetchCoupons(signal?: AbortSignal): Promise<Coupon[]> {
  return client.get<Coupon[]>(endpoints.coupons.list, { signal });
}

export function createCoupon(payload: CouponPayload): Promise<Coupon> {
  return client.post<Coupon>(endpoints.coupons.list, payload);
}

export function updateCoupon(
  id: number,
  payload: CouponPayload,
): Promise<Coupon> {
  return client.put<Coupon>(endpoints.coupons.byId(id), payload);
}

export function deleteCoupon(id: number): Promise<void> {
  return client.del<void>(endpoints.coupons.byId(id));
}

export function toggleCouponStatus(
  id: number,
  status: CouponStatus,
): Promise<Coupon> {
  return client.patch<Coupon>(endpoints.coupons.byId(id), { status });
}
