import { formatDate } from '../../utils/dateUtils';
import type { ReportSummary } from './types';
import { formatCurrency } from './utils';

export type ReportsSummaryCardsProps = {
  summary: ReportSummary;
};

type SummaryCardProps = {
  label: string;
  value: string;
  valueModifier?: 'small';
  sub?: string;
};

function SummaryCard({ label, value, valueModifier, sub }: SummaryCardProps) {
  const valueClass =
    'reports-stat-card__value' +
    (valueModifier === 'small' ? ' reports-stat-card__value--small' : '');

  return (
    <div className="reports-stat-card">
      <p className="reports-stat-card__label">{label}</p>
      <p className={valueClass}>
        {value}
        {sub ? <span className="reports-stat-card__sub">{sub}</span> : null}
      </p>
    </div>
  );
}

export function ReportsSummaryCards({ summary }: ReportsSummaryCardsProps) {
  const bestDayLabel = summary.bestDay === 'N/A' ? 'N/A' : formatDate(summary.bestDay);
  const bestDaySub =
    summary.bestDayRevenue > 0 ? formatCurrency(summary.bestDayRevenue) : undefined;

  return (
    <div className="reports-summary-grid">
      <SummaryCard label="Total Revenue" value={formatCurrency(summary.totalRevenue)} />
      <SummaryCard label="Total Orders" value={summary.totalOrders.toLocaleString()} />
      <SummaryCard label="Avg Order Value" value={formatCurrency(summary.avgOrderValue)} />
      <SummaryCard
        label="Best Day"
        value={bestDayLabel}
        valueModifier="small"
        sub={bestDaySub}
      />
    </div>
  );
}

export default ReportsSummaryCards;
