import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import type { BreadcrumbItem } from '../../components/Breadcrumb/Breadcrumb';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { Chart } from '../../components/Chart/Chart';
import { useReportsData } from '../../hooks/useReportsData';
import { ReportsFilters } from './ReportsFilters';
import { ReportsSummaryCards } from './ReportsSummaryCards';
import { ReportsTable } from './ReportsTable';
import { downloadCSV } from './utils';
import type { CsvRow } from './utils';
import './Reports.css';

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Reports' },
];

function Reports() {
  const {
    salesReport,
    loading,
    error,
    quickRange,
    startDate,
    endDate,
    summary,
    revenueChart,
    ordersChart,
    hasData,
    setQuickRange,
    setStartDate,
    setEndDate,
    applyFilter,
  } = useReportsData();

  const handleExport = (): void => {
    const csvRows: CsvRow[] = salesReport.map((row) => ({
      Date: row.date,
      Revenue: '$' + row.revenue.toFixed(2),
      Orders: row.orders,
      'Avg Order Value': '$' + row.avgOrderValue.toFixed(2),
    }));
    const filename = `sales-report-${startDate}-to-${endDate}.csv`;
    downloadCSV(csvRows, filename);
  };

  return (
    <div className="reports-page">
      <Breadcrumb items={BREADCRUMB_ITEMS} />

      <div className="reports-page__header">
        <h2>Sales Reports</h2>
        <p className="reports-page__subtitle">
          View sales performance and generate reports
        </p>
      </div>

      {error ? (
        <div className="reports-page__error-banner" role="alert">
          {error}
        </div>
      ) : null}

      <ReportsFilters
        quickRange={quickRange}
        startDate={startDate}
        endDate={endDate}
        canExport={hasData}
        onQuickRangeChange={setQuickRange}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onApply={applyFilter}
        onExport={handleExport}
      />

      {loading ? (
        <LoadingSpinner message="Generating report..." />
      ) : (
        <div>
          <ReportsSummaryCards summary={summary} />

          <div className="reports-charts-grid">
            <Chart
              type="bar"
              title="Daily Revenue"
              data={revenueChart}
              height={220}
              barColor="#4a90d9"
            />
            <Chart
              type="line"
              title="Daily Orders"
              data={ordersChart}
              height={220}
              lineColor="#27ae60"
            />
          </div>

          <ReportsTable rows={salesReport} />
        </div>
      )}
    </div>
  );
}

export default Reports;
