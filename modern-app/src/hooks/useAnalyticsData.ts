import { useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import {
  fetchAnalyticsData,
  type AnalyticsRange,
} from '../api/services/analytics';
import type { AnalyticsData, Period } from '../pages/Analytics/types';
import { MOCK_ANALYTICS } from '../pages/Analytics/mockAnalytics';

function getRangeForPeriod(period: Period): AnalyticsRange {
  const end = new Date();
  const start = new Date(end);

  switch (period) {
    case 'last7days':
      start.setDate(end.getDate() - 7);
      break;
    case 'last30days':
      start.setDate(end.getDate() - 30);
      break;
    case 'thisMonth':
      start.setDate(1);
      break;
    case 'lastMonth':
      start.setMonth(end.getMonth() - 1, 1);
      end.setDate(0);
      break;
    case 'thisYear':
      start.setMonth(0, 1);
      break;
  }

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

function messageFrom(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export type UseAnalyticsData = {
  analyticsData: AnalyticsData;
  loading: boolean;
  error: string | null;
  selectedPeriod: Period;
  setSelectedPeriod: (period: Period) => void;
};

export function useAnalyticsData(
  initialPeriod: Period = 'last30days',
): UseAnalyticsData {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(initialPeriod);
  // Legacy analyticsActions falls back to mockSalesData on API failure —
  // keeping MOCK as the initial value means the page never renders against undefined.
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(MOCK_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    (async () => {
      try {
        const data = await fetchAnalyticsData(
          getRangeForPeriod(selectedPeriod),
          controller.signal,
        );
        if (!cancelled) {
          setAnalyticsData(data);
          setError(null);
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        setAnalyticsData(MOCK_ANALYTICS);
        setError(messageFrom(err, 'Failed to load analytics'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedPeriod]);

  return {
    analyticsData,
    loading,
    error,
    selectedPeriod,
    setSelectedPeriod,
  };
}

export default useAnalyticsData;
