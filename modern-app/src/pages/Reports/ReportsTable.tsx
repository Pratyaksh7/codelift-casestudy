import { formatDate } from '../../utils/dateUtils';
import type { SalesReportRow } from './types';
import { formatCurrency } from './utils';

const MAX_ROWS = 20;

export type ReportsTableProps = {
  rows: SalesReportRow[];
};

export function ReportsTable({ rows }: ReportsTableProps) {
  const hasData = rows.length > 0;
  const visibleRows = hasData ? rows.slice(0, MAX_ROWS) : [];

  return (
    <div className="reports-table-section">
      <h3 className="reports-table-section__title">Detailed Report</h3>
      <table className="reports-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Revenue</th>
            <th>Orders</th>
            <th>Avg Order Value</th>
          </tr>
        </thead>
        <tbody>
          {hasData ? (
            visibleRows.map((row) => (
              <tr key={row.date}>
                <td className="reports-table__date">{formatDate(row.date)}</td>
                <td className="reports-table__revenue">{formatCurrency(row.revenue)}</td>
                <td>{row.orders}</td>
                <td>{formatCurrency(row.avgOrderValue)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="reports-table__empty">
                No report data available for the selected period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReportsTable;
