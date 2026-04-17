import type { AnalyticsData } from './types';

// TODO: wire to API — GET /api/analytics?start&end
// Verbatim port of legacy mockSalesData.
export const MOCK_ANALYTICS: AnalyticsData = {
  daily: [
    { date: '2022-01-09', revenue: 2340, orders: 12 },
    { date: '2022-01-10', revenue: 3120, orders: 18 },
    { date: '2022-01-11', revenue: 2890, orders: 15 },
    { date: '2022-01-12', revenue: 4560, orders: 24 },
    { date: '2022-01-13', revenue: 3780, orders: 20 },
    { date: '2022-01-14', revenue: 5210, orders: 28 },
    { date: '2022-01-15', revenue: 4890, orders: 26 },
  ],
  monthly: [
    { month: 'Jan', revenue: 45600, orders: 234 },
    { month: 'Feb', revenue: 52300, orders: 267 },
    { month: 'Mar', revenue: 48900, orders: 251 },
    { month: 'Apr', revenue: 61200, orders: 312 },
    { month: 'May', revenue: 55800, orders: 289 },
    { month: 'Jun', revenue: 67400, orders: 345 },
    { month: 'Jul', revenue: 72100, orders: 368 },
    { month: 'Aug', revenue: 64300, orders: 330 },
    { month: 'Sep', revenue: 58900, orders: 301 },
    { month: 'Oct', revenue: 71200, orders: 364 },
    { month: 'Nov', revenue: 89400, orders: 456 },
    { month: 'Dec', revenue: 95600, orders: 489 },
  ],
  topProducts: [
    { name: 'Wireless Bluetooth Headphones', sales: 156, revenue: 12480 },
    { name: 'Mechanical Keyboard RGB', sales: 98, revenue: 14700 },
    { name: 'Running Shoes Pro', sales: 87, revenue: 11310 },
    { name: 'LED Desk Lamp', sales: 134, revenue: 5356 },
    { name: 'Cotton T-Shirt Pack (3)', sales: 201, revenue: 6030 },
  ],
  topCategories: [
    { name: 'Electronics', percentage: 35 },
    { name: 'Clothing', percentage: 22 },
    { name: 'Sports', percentage: 18 },
    { name: 'Home & Garden', percentage: 15 },
    { name: 'Books', percentage: 10 },
  ],
  visitors: {
    total: 45230,
    unique: 28900,
    bounceRate: 42.5,
    avgSessionDuration: 245,
  },
};
