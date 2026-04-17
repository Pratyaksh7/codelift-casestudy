export type SalesReportRow = {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
};

export type QuickRange =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'custom';

export type ReportSummary = {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  bestDay: string;
  bestDayRevenue: number;
};
