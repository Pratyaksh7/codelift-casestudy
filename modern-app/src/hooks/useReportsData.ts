import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../api/client';
import { fetchSalesReport } from '../api/services/analytics';
import { MOCK_SALES_REPORT } from '../pages/Reports/mockReports';
import type { QuickRange, ReportSummary, SalesReportRow } from '../pages/Reports/types';
import type { ChartDatum } from '../components/Chart/Chart';
import {
  computeReportSummary,
  getDateRange,
  toChartData,
} from '../pages/Reports/utils';

function messageFrom(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export type UseReportsData = {
  salesReport: SalesReportRow[];
  loading: boolean;
  error: string | null;
  quickRange: QuickRange;
  startDate: string;
  endDate: string;
  summary: ReportSummary;
  revenueChart: ChartDatum[];
  ordersChart: ChartDatum[];
  hasData: boolean;
  setQuickRange: (next: QuickRange) => void;
  setStartDate: (next: string) => void;
  setEndDate: (next: string) => void;
  applyFilter: () => void;
};

export function useReportsData(
  initialRange: QuickRange = 'last30days',
): UseReportsData {
  const defaultRange = useMemo(() => getDateRange(initialRange), [initialRange]);

  const [startDate, setStartDate] = useState<string>(defaultRange.startFormatted);
  const [endDate, setEndDate] = useState<string>(defaultRange.endFormatted);
  const [quickRange, setQuickRangeState] = useState<QuickRange>(initialRange);
  const [salesReport, setSalesReport] = useState<SalesReportRow[]>(MOCK_SALES_REPORT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Fetch runs on mount and whenever fetchToken changes — custom date edits do NOT
  // bump the token; only quick-range changes and the Apply button do.
  const [fetchToken, setFetchToken] = useState(0);
  const [pendingStart, setPendingStart] = useState(defaultRange.startFormatted);
  const [pendingEnd, setPendingEnd] = useState(defaultRange.endFormatted);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    (async () => {
      try {
        const rows = await fetchSalesReport(
          { start: pendingStart, end: pendingEnd },
          controller.signal,
        );
        if (!cancelled) {
          setSalesReport(rows);
          setError(null);
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        // Legacy analyticsActions.fetchSalesReport falls back to generated mock data on failure.
        setSalesReport(MOCK_SALES_REPORT);
        setError(messageFrom(err, 'Failed to load sales report'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [fetchToken, pendingStart, pendingEnd]);

  const summary = useMemo(() => computeReportSummary(salesReport), [salesReport]);
  const revenueChart = useMemo(() => toChartData(salesReport, 'revenue'), [salesReport]);
  const ordersChart = useMemo(() => toChartData(salesReport, 'orders'), [salesReport]);

  const setQuickRange = useCallback((next: QuickRange): void => {
    const range = getDateRange(next);
    setQuickRangeState(next);
    setStartDate(range.startFormatted);
    setEndDate(range.endFormatted);
    setPendingStart(range.startFormatted);
    setPendingEnd(range.endFormatted);
    setFetchToken((t) => t + 1);
  }, []);

  const applyFilter = useCallback((): void => {
    setPendingStart(startDate);
    setPendingEnd(endDate);
    setFetchToken((t) => t + 1);
  }, [startDate, endDate]);

  return {
    salesReport,
    loading,
    error,
    quickRange,
    startDate,
    endDate,
    summary,
    revenueChart,
    ordersChart,
    hasData: salesReport.length > 0,
    setQuickRange,
    setStartDate: (next: string) => {
      setStartDate(next);
      setQuickRangeState('custom');
    },
    setEndDate: (next: string) => {
      setEndDate(next);
      setQuickRangeState('custom');
    },
    applyFilter,
  };
}

export default useReportsData;
