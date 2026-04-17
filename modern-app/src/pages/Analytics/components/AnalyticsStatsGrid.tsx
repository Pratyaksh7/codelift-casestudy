import type { VisitorStats } from '../types';
import { formatCompactNumber, formatSessionDuration } from '../utils';

type StatCardProps = {
  iconClass: string;
  icon: string;
  label: string;
  value: string;
};

function AnalyticsStatCard({ iconClass, icon, label, value }: StatCardProps) {
  return (
    <div className="analytics-stat-card">
      <div className={`analytics-stat-icon ${iconClass}`}>{icon}</div>
      <div>
        <p className="analytics-stat-label">{label}</p>
        <p className="analytics-stat-value">{value}</p>
      </div>
    </div>
  );
}

export type AnalyticsStatsGridProps = {
  visitors: VisitorStats;
};

export function AnalyticsStatsGrid({ visitors }: AnalyticsStatsGridProps) {
  const { minutes, seconds } = formatSessionDuration(visitors.avgSessionDuration);

  return (
    <div className="analytics-stats-grid">
      <AnalyticsStatCard
        iconClass="analytics-stat-icon--visitors"
        icon={'\u{1F465}'}
        label="Total Visitors"
        value={formatCompactNumber(visitors.total)}
      />
      <AnalyticsStatCard
        iconClass="analytics-stat-icon--unique"
        icon={'\u{1F464}'}
        label="Unique Visitors"
        value={formatCompactNumber(visitors.unique)}
      />
      <AnalyticsStatCard
        iconClass="analytics-stat-icon--bounce"
        icon={'\u{1F4C8}'}
        label="Bounce Rate"
        value={`${visitors.bounceRate}%`}
      />
      <AnalyticsStatCard
        iconClass="analytics-stat-icon--session"
        icon={'\u{23F1}'}
        label="Avg. Session"
        value={`${minutes}m ${seconds}s`}
      />
    </div>
  );
}

export default AnalyticsStatsGrid;
