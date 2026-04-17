import { useMemo } from 'react';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import type { BreadcrumbItem } from '../../components/Breadcrumb/Breadcrumb';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { Chart } from '../../components/Chart/Chart';
import type { ChartDatum } from '../../components/Chart/Chart';
import { useAnalyticsData } from '../../hooks/useAnalyticsData';
import { AnalyticsHeader } from './components/AnalyticsHeader';
import { AnalyticsStatsGrid } from './components/AnalyticsStatsGrid';
import { TopProductsTable } from './components/TopProductsTable';
import { formatDateMMDD } from './utils';
import type { AnalyticsData } from './types';
import './Analytics.css';

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Analytics' },
];

const TOP_PRODUCT_LABEL_MAX_LENGTH = 20;

type ChartDataSets = {
  revenue: ChartDatum[];
  orders: ChartDatum[];
  monthly: ChartDatum[];
  category: ChartDatum[];
  topProducts: ChartDatum[];
};

function buildChartData(analyticsData: AnalyticsData): ChartDataSets {
  return {
    revenue: analyticsData.daily.map((d) => ({
      label: formatDateMMDD(d.date),
      value: d.revenue,
    })),
    orders: analyticsData.daily.map((d) => ({
      label: formatDateMMDD(d.date),
      value: d.orders,
    })),
    monthly: analyticsData.monthly.map((d) => ({
      label: d.month,
      value: d.revenue,
    })),
    category: analyticsData.topCategories.map((c) => ({
      label: c.name,
      value: c.percentage,
    })),
    topProducts: analyticsData.topProducts.map((p) => ({
      label: p.name.substring(0, TOP_PRODUCT_LABEL_MAX_LENGTH),
      value: p.revenue,
    })),
  };
}

function Analytics() {
  const { analyticsData, loading, error, selectedPeriod, setSelectedPeriod } =
    useAnalyticsData();

  const chartData = useMemo(() => buildChartData(analyticsData), [analyticsData]);

  if (loading) {
    return (
      <div className="analytics-page">
        <Breadcrumb items={BREADCRUMB_ITEMS} />
        <LoadingSpinner fullPage message="Loading analytics data..." />
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <Breadcrumb items={BREADCRUMB_ITEMS} />

      {error ? (
        <div className="analytics-page__error-banner" role="alert">
          {error}
        </div>
      ) : null}

      <AnalyticsHeader
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      <AnalyticsStatsGrid visitors={analyticsData.visitors} />

      {/* Charts Row 1 */}
      <div className="analytics-charts-row">
        <Chart
          type="bar"
          title="Daily Revenue"
          data={chartData.revenue}
          height={220}
          barColor="#4a90d9"
        />
        <Chart
          type="line"
          title="Daily Orders"
          data={chartData.orders}
          height={220}
          lineColor="#27ae60"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="analytics-charts-row">
        <Chart
          type="bar"
          title="Monthly Revenue"
          data={chartData.monthly}
          height={220}
          barColor="#9b59b6"
        />
        <Chart
          type="donut"
          title="Sales by Category"
          data={chartData.category}
          height={180}
        />
      </div>

      <TopProductsTable products={analyticsData.topProducts} />

      {/* Top Products Bar Chart */}
      <div className="analytics-top-products-chart">
        <Chart
          type="bar"
          title="Top Products by Revenue"
          data={chartData.topProducts}
          height={200}
          barColor="#e67e22"
        />
      </div>
    </div>
  );
}

export default Analytics;
