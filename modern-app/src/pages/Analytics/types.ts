export type DailyPoint = {
  date: string;
  revenue: number;
  orders: number;
};

export type MonthlyPoint = {
  month: string;
  revenue: number;
  orders: number;
};

export type TopProduct = {
  name: string;
  sales: number;
  revenue: number;
};

export type TopCategory = {
  name: string;
  percentage: number;
};

export type VisitorStats = {
  total: number;
  unique: number;
  bounceRate: number;
  avgSessionDuration: number;
};

export type AnalyticsData = {
  daily: DailyPoint[];
  monthly: MonthlyPoint[];
  topProducts: TopProduct[];
  topCategories: TopCategory[];
  visitors: VisitorStats;
};

export type Period =
  | 'last7days'
  | 'last30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear';

export type PeriodOption = {
  value: Period;
  label: string;
};

export const PERIOD_OPTIONS: readonly PeriodOption[] = [
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'thisYear', label: 'This Year' },
];
