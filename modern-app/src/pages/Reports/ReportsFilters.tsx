import type { ChangeEvent } from 'react';
import type { QuickRange } from './types';

type QuickRangeOption = {
  value: QuickRange;
  label: string;
};

const QUICK_RANGE_OPTIONS: QuickRangeOption[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'thisYear', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

export type ReportsFiltersProps = {
  quickRange: QuickRange;
  startDate: string;
  endDate: string;
  canExport: boolean;
  onQuickRangeChange: (next: QuickRange) => void;
  onStartDateChange: (next: string) => void;
  onEndDateChange: (next: string) => void;
  onApply: () => void;
  onExport: () => void;
};

export function ReportsFilters({
  quickRange,
  startDate,
  endDate,
  canExport,
  onQuickRangeChange,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onExport,
}: ReportsFiltersProps) {
  const handleQuickRange = (e: ChangeEvent<HTMLSelectElement>): void => {
    onQuickRangeChange(e.target.value as QuickRange);
  };

  const handleStart = (e: ChangeEvent<HTMLInputElement>): void => {
    onStartDateChange(e.target.value);
  };

  const handleEnd = (e: ChangeEvent<HTMLInputElement>): void => {
    onEndDateChange(e.target.value);
  };

  return (
    <div className="reports-filters">
      <div className="reports-filters__left">
        <select
          className="reports-filters__select"
          value={quickRange}
          onChange={handleQuickRange}
        >
          {QUICK_RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="reports-filters__dates">
          <input
            type="date"
            className="reports-filters__input"
            value={startDate}
            onChange={handleStart}
          />
          <span className="reports-filters__to">to</span>
          <input
            type="date"
            className="reports-filters__input"
            value={endDate}
            onChange={handleEnd}
          />
        </div>
        <button
          type="button"
          className="reports-btn reports-btn--primary"
          onClick={onApply}
        >
          Apply
        </button>
      </div>
      <button
        type="button"
        className="reports-btn reports-btn--success"
        onClick={onExport}
        disabled={!canExport}
      >
        Export CSV
      </button>
    </div>
  );
}

export default ReportsFilters;
