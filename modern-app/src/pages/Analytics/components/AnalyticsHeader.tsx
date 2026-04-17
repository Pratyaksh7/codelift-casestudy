import type { ChangeEvent } from 'react';
import type { Period } from '../types';
import { PERIOD_OPTIONS } from '../types';

export type AnalyticsHeaderProps = {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
};

export function AnalyticsHeader({
  selectedPeriod,
  onPeriodChange,
}: AnalyticsHeaderProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    // TODO: wire to API — refetch on period change
    onPeriodChange(event.target.value as Period);
  };

  return (
    <div className="analytics-page-header">
      <div>
        <h2>Analytics</h2>
        <p className="page-subtitle">Track your store performance and growth</p>
      </div>
      <select
        className="filter-select"
        value={selectedPeriod}
        onChange={handleChange}
      >
        {PERIOD_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AnalyticsHeader;
