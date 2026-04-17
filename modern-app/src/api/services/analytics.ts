import type { AnalyticsData } from '../../pages/Analytics/types';
import type { SalesReportRow } from '../../pages/Reports/types';
import { client } from '../client';
import { endpoints } from '../endpoints';

export type AnalyticsRange = { start: string; end: string };

export function fetchAnalyticsData(
  range: AnalyticsRange,
  signal?: AbortSignal,
): Promise<AnalyticsData> {
  const query = new URLSearchParams({ start: range.start, end: range.end }).toString();
  return client.get<AnalyticsData>(`${endpoints.analytics.data}?${query}`, { signal });
}

export function fetchSalesReport(
  range: AnalyticsRange,
  signal?: AbortSignal,
): Promise<SalesReportRow[]> {
  const query = new URLSearchParams({ start: range.start, end: range.end }).toString();
  return client.get<SalesReportRow[]>(
    `${endpoints.analytics.salesReport}?${query}`,
    { signal },
  );
}
