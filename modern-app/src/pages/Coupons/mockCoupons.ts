export type CouponType = 'percentage' | 'fixed_amount' | 'free_shipping' | 'bogo';

export type CouponStatus = 'active' | 'inactive' | 'expired' | 'scheduled';

export type Coupon = {
  id: number;
  code: string;
  type: CouponType;
  value: number;
  minPurchase: number;
  maxUses: number | null;
  usedCount: number;
  status: CouponStatus;
  startDate: string;
  endDate: string;
  description: string;
};

// Mirrors legacy src/redux/actions/couponActions.js mockCoupons fallback.
export const mockCoupons: Coupon[] = [
  {
    id: 1,
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minPurchase: 50,
    maxUses: 1000,
    usedCount: 342,
    status: 'active',
    startDate: '2022-01-01T00:00:00Z',
    endDate: '2022-06-30T23:59:59Z',
    description: 'Welcome discount for new customers',
  },
  {
    id: 2,
    code: 'WINTER20',
    type: 'percentage',
    value: 20,
    minPurchase: 100,
    maxUses: 500,
    usedCount: 189,
    status: 'active',
    startDate: '2022-01-01T00:00:00Z',
    endDate: '2022-02-28T23:59:59Z',
    description: 'Winter sale 20% off',
  },
  {
    id: 3,
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    minPurchase: 75,
    maxUses: null,
    usedCount: 567,
    status: 'active',
    startDate: '2021-06-01T00:00:00Z',
    endDate: '2022-12-31T23:59:59Z',
    description: 'Free shipping on orders over $75',
  },
  {
    id: 4,
    code: 'SAVE15',
    type: 'fixed_amount',
    value: 15,
    minPurchase: 80,
    maxUses: 200,
    usedCount: 200,
    status: 'inactive',
    startDate: '2021-10-01T00:00:00Z',
    endDate: '2021-12-31T23:59:59Z',
    description: '$15 off orders over $80',
  },
  {
    id: 5,
    code: 'SUMMER25',
    type: 'percentage',
    value: 25,
    minPurchase: 150,
    maxUses: 300,
    usedCount: 0,
    status: 'scheduled',
    startDate: '2022-06-01T00:00:00Z',
    endDate: '2022-08-31T23:59:59Z',
    description: 'Summer sale 25% off',
  },
  {
    id: 6,
    code: 'VIP50',
    type: 'fixed_amount',
    value: 50,
    minPurchase: 200,
    maxUses: 50,
    usedCount: 12,
    status: 'active',
    startDate: '2022-01-01T00:00:00Z',
    endDate: '2022-12-31T23:59:59Z',
    description: 'VIP exclusive $50 off',
  },
  {
    id: 7,
    code: 'FLASH30',
    type: 'percentage',
    value: 30,
    minPurchase: 0,
    maxUses: 100,
    usedCount: 100,
    status: 'expired',
    startDate: '2021-11-26T00:00:00Z',
    endDate: '2021-11-26T23:59:59Z',
    description: 'Black Friday flash sale',
  },
  {
    id: 8,
    code: 'BOGO2022',
    type: 'bogo',
    value: 0,
    minPurchase: 0,
    maxUses: 250,
    usedCount: 78,
    status: 'active',
    startDate: '2022-01-15T00:00:00Z',
    endDate: '2022-03-15T23:59:59Z',
    description: 'Buy one get one free on selected items',
  },
];
