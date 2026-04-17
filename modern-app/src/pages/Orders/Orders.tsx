import { useMemo, useState } from 'react';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import type { OrderStatus } from '../../components/StatusBadge/StatusBadge';
import { useOrders } from '../../hooks/useOrders';
import { formatDate, formatRelative } from './formatDate';
import { sortOrders } from './sortOrders';
import type { FilterStatus, SortBy, SortDir } from './types';
import './Orders.css';

function Orders() {
  const { orders, loading, error, updateStatus } = useOrders();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    void updateStatus(orderId, newStatus);
  };

  const filteredOrders = useMemo(() => {
    if (filterStatus === 'all') return orders;
    return orders.filter((o) => o.status === filterStatus);
  }, [orders, filterStatus]);

  const sortedOrders = useMemo(
    () => sortOrders(filteredOrders, sortBy, sortDir),
    [filteredOrders, sortBy, sortDir],
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing',
  ).length;

  const sortIndicator = (column: SortBy) =>
    sortBy === column ? (sortDir === 'asc' ? '\u25B2' : '\u25BC') : '';

  return (
    <div className="orders-page">
      <div className="orders-page__header">
        <h2>Orders</h2>
        <p className="orders-page__subtitle">View and manage customer orders</p>
      </div>

      {error ? (
        <div className="orders-page__error-banner" role="alert">
          {error}
        </div>
      ) : null}

      <div className="orders-page__summary">
        <div className="orders-page__summary-item">
          <span className="orders-page__summary-label">Total Orders</span>
          <span className="orders-page__summary-value">{orders.length}</span>
        </div>
        <div className="orders-page__summary-item">
          <span className="orders-page__summary-label">Revenue</span>
          <span className="orders-page__summary-value">
            ${totalRevenue.toFixed(2)}
          </span>
        </div>
        <div className="orders-page__summary-item">
          <span className="orders-page__summary-label">Pending/Processing</span>
          <span className="orders-page__summary-value orders-page__summary-value--warn">
            {pendingCount}
          </span>
        </div>
      </div>

      <div className="orders-page__toolbar">
        <select
          className="orders-page__filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="orders-page__loading">Loading orders...</p>
      ) : (
        <div className="orders-page__table-wrap">
          <table className="orders-page__table">
            <thead>
              <tr>
                <th
                  className="orders-page__th orders-page__th--sortable"
                  onClick={() => handleSort('id')}
                >
                  Order ID {sortIndicator('id')}
                </th>
                <th className="orders-page__th">Customer</th>
                <th className="orders-page__th">Items</th>
                <th
                  className="orders-page__th orders-page__th--sortable"
                  onClick={() => handleSort('total')}
                >
                  Total {sortIndicator('total')}
                </th>
                <th className="orders-page__th">Status</th>
                <th
                  className="orders-page__th orders-page__th--sortable"
                  onClick={() => handleSort('date')}
                >
                  Date {sortIndicator('date')}
                </th>
                <th className="orders-page__th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="orders-page__empty">
                    No orders found.
                  </td>
                </tr>
              ) : (
                sortedOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="orders-page__order-id">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>
                      {order.items} item{order.items !== 1 ? 's' : ''}
                    </td>
                    <td className="orders-page__total">
                      ${order.total.toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="orders-page__date-cell">
                      {formatDate(order.date)}
                      <br />
                      <span className="orders-page__date-relative">
                        {formatRelative(order.date)}
                      </span>
                    </td>
                    <td>
                      {order.status !== 'completed' &&
                        order.status !== 'cancelled' && (
                          <select
                            className="orders-page__status-select"
                            value=""
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value as OrderStatus,
                              )
                            }
                          >
                            <option value="" disabled>
                              Change...
                            </option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Orders;
