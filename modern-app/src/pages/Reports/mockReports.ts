import type { SalesReportRow } from './types';

// Static mock sales report — 30 days of fabricated daily totals.
// TODO: wire to API (GET /api/analytics/sales-report?start=&end=)
const RAW_ROWS: ReadonlyArray<Omit<SalesReportRow, 'avgOrderValue'>> = [
  { date: '2026-03-15', revenue: 4821.5, orders: 42 },
  { date: '2026-03-16', revenue: 5320.75, orders: 47 },
  { date: '2026-03-17', revenue: 3980.0, orders: 35 },
  { date: '2026-03-18', revenue: 6102.25, orders: 54 },
  { date: '2026-03-19', revenue: 7245.0, orders: 63 },
  { date: '2026-03-20', revenue: 8120.5, orders: 71 },
  { date: '2026-03-21', revenue: 9032.75, orders: 79 },
  { date: '2026-03-22', revenue: 6512.0, orders: 58 },
  { date: '2026-03-23', revenue: 5480.25, orders: 49 },
  { date: '2026-03-24', revenue: 4210.0, orders: 38 },
  { date: '2026-03-25', revenue: 5890.5, orders: 52 },
  { date: '2026-03-26', revenue: 6720.0, orders: 60 },
  { date: '2026-03-27', revenue: 7815.75, orders: 69 },
  { date: '2026-03-28', revenue: 8630.25, orders: 76 },
  { date: '2026-03-29', revenue: 9410.0, orders: 83 },
  { date: '2026-03-30', revenue: 7120.5, orders: 64 },
  { date: '2026-03-31', revenue: 6340.0, orders: 57 },
  { date: '2026-04-01', revenue: 5980.75, orders: 53 },
  { date: '2026-04-02', revenue: 6890.0, orders: 61 },
  { date: '2026-04-03', revenue: 8210.5, orders: 72 },
  { date: '2026-04-04', revenue: 9540.25, orders: 84 },
  { date: '2026-04-05', revenue: 10320.0, orders: 91 },
  { date: '2026-04-06', revenue: 7450.5, orders: 66 },
  { date: '2026-04-07', revenue: 6820.0, orders: 60 },
  { date: '2026-04-08', revenue: 7190.75, orders: 64 },
  { date: '2026-04-09', revenue: 8030.5, orders: 71 },
  { date: '2026-04-10', revenue: 8920.0, orders: 79 },
  { date: '2026-04-11', revenue: 9650.25, orders: 85 },
  { date: '2026-04-12', revenue: 10480.0, orders: 93 },
  { date: '2026-04-13', revenue: 11210.5, orders: 99 },
];

export const MOCK_SALES_REPORT: SalesReportRow[] = RAW_ROWS.map((row) => ({
  ...row,
  avgOrderValue: row.orders > 0 ? row.revenue / row.orders : 0,
}));
