import type { ChartDatum } from '../../components/Chart/Chart';
import type { QuickRange, ReportSummary, SalesReportRow } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;
const CHART_MAX_POINTS = 14;

function toYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export type QuickRangeResult = {
  startFormatted: string;
  endFormatted: string;
};

export function getDateRange(period: QuickRange): QuickRangeResult {
  const now = new Date();
  let start: Date;
  let end: Date;

  switch (period) {
    case 'today':
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    case 'yesterday': {
      const y = addDays(now, -1);
      start = startOfDay(y);
      end = endOfDay(y);
      break;
    }
    case 'last7days':
      start = startOfDay(addDays(now, -7));
      end = endOfDay(now);
      break;
    case 'last30days':
      start = startOfDay(addDays(now, -30));
      end = endOfDay(now);
      break;
    case 'thisMonth':
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    case 'lastMonth': {
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      start = startOfMonth(prev);
      end = endOfMonth(prev);
      break;
    }
    case 'thisYear':
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    case 'custom':
    default:
      start = startOfDay(addDays(now, -30));
      end = endOfDay(now);
      break;
  }

  return {
    startFormatted: toYmd(start),
    endFormatted: toYmd(end),
  };
}

export function formatCurrency(amount: number): string {
  return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export function formatDateMMDD(iso: string): string {
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  return `${parts[1]}/${parts[2]}`;
}

export function computeReportSummary(rows: SalesReportRow[]): ReportSummary {
  if (rows.length === 0) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      bestDay: 'N/A',
      bestDayRevenue: 0,
    };
  }

  const totalRevenue = rows.reduce((sum, r) => sum + r.revenue, 0);
  const totalOrders = rows.reduce((sum, r) => sum + r.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const bestRow = rows.reduce(
    (best, r) => (r.revenue > best.revenue ? r : best),
    rows[0],
  );

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    bestDay: bestRow.date,
    bestDayRevenue: bestRow.revenue,
  };
}

export function toChartData(
  rows: SalesReportRow[],
  key: 'revenue' | 'orders',
): ChartDatum[] {
  const trimmed =
    rows.length > CHART_MAX_POINTS ? rows.slice(rows.length - CHART_MAX_POINTS) : rows;
  return trimmed.map((r) => ({
    label: formatDateMMDD(r.date),
    value: r[key],
  }));
}

export type CsvCell = string | number;
export type CsvRow = Record<string, CsvCell>;

export function downloadCSV(rows: CsvRow[], filename: string): void {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const escape = (val: CsvCell): string =>
    '"' + String(val).replace(/"/g, '""') + '"';

  const lines = [headers.join(',')];
  rows.forEach((row) => {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  });

  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
