import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { fetchOrders, updateOrderStatus } from '../redux/actions/orderActions';
import './Orders.css';

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterStatus: 'all',
      sortBy: 'date',
      sortDir: 'desc',
    }
  }

  componentDidMount() {
    this.props.fetchOrders();
  }

  handleFilterChange = (e) => {
    this.setState({ filterStatus: e.target.value })
  }

  handleSort = (column) => {
    this.setState(function(prevState) {
      if (prevState.sortBy === column) {
        return { sortDir: prevState.sortDir === 'asc' ? 'desc' : 'asc' }
      }
      return { sortBy: column, sortDir: 'asc' }
    })
  }

  handleStatusChange = (orderId, newStatus) => {
    console.log('changing order', orderId, 'to', newStatus);
    this.props.updateOrderStatus(orderId, newStatus);
  }

  getStatusColor(status) {
    switch(status) {
      case 'completed': return '#27ae60';
      case 'processing': return '#f39c12';
      case 'shipped': return '#3498db';
      case 'pending': return '#95a5a6';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  }

  getSortedOrders(orders) {
    var self = this;
    var sorted = orders.slice().sort(function(a, b) {
      var valA, valB;
      if (self.state.sortBy === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      } else if (self.state.sortBy === 'total') {
        valA = a.total;
        valB = b.total;
      } else {
        valA = a[self.state.sortBy];
        valB = b[self.state.sortBy];
      }

      if (self.state.sortDir === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
    return sorted;
  }

  render() {
    const { orders, loading } = this.props;
    const { filterStatus } = this.state;

    var filteredOrders = orders;
    if (filterStatus !== 'all') {
      filteredOrders = orders.filter(function(o) {
        return o.status === filterStatus;
      });
    }

    var sortedOrders = this.getSortedOrders(filteredOrders);

    // calculate some summary stats
    var totalRevenue = orders.reduce(function(sum, o) { return sum + o.total; }, 0);
    var pendingCount = orders.filter(function(o) { return o.status === 'pending' || o.status === 'processing'; }).length;

    return (
      <div className="orders-page">
        <div className="page-header">
          <h2>Orders</h2>
          <p className="page-subtitle">View and manage customer orders</p>
        </div>

        <div className="orders-summary">
          <div className="summary-item">
            <span className="summary-label">Total Orders</span>
            <span className="summary-value">{orders.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Revenue</span>
            <span className="summary-value">${totalRevenue.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Pending/Processing</span>
            <span className="summary-value" style={{color: '#f39c12'}}>{pendingCount}</span>
          </div>
        </div>

        <div className="orders-toolbar">
          <select className="filter-select" value={filterStatus} onChange={this.handleFilterChange}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <p style={{color: '#888', padding: 20}}>Loading orders...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => this.handleSort('id')} style={{cursor: 'pointer'}}>
                  Order ID {this.state.sortBy === 'id' ? (this.state.sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>Customer</th>
                <th>Items</th>
                <th onClick={() => this.handleSort('total')} style={{cursor: 'pointer'}}>
                  Total {this.state.sortBy === 'total' ? (this.state.sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>Status</th>
                <th onClick={() => this.handleSort('date')} style={{cursor: 'pointer'}}>
                  Date {this.state.sortBy === 'date' ? (this.state.sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', color: '#aaa', padding: 40}}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                sortedOrders.map(function(order) {
                  return (
                    <tr key={order.id}>
                      <td style={{fontWeight: 500, color: '#4a90d9'}}>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.items} item{order.items !== 1 ? 's' : ''}</td>
                      <td style={{fontWeight: 500}}>${order.total.toFixed(2)}</td>
                      <td>
                        <span style={{
                          backgroundColor: this.getStatusColor(order.status),
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 500,
                          textTransform: 'capitalize',
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{color: '#888', fontSize: 13}}>
                        {moment(order.date).format('MMM DD, YYYY')}
                        <br />
                        <span style={{fontSize: 11}}>{moment(order.date).fromNow()}</span>
                      </td>
                      <td>
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <select
                            className="status-select"
                            value=""
                            onChange={(e) => this.handleStatusChange(order.id, e.target.value)}
                          >
                            <option value="" disabled>Change...</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                }.bind(this))
              )}
            </tbody>
          </table>
        )}
      </div>
    )
  }
}

Orders.propTypes = {
  orders: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  fetchOrders: PropTypes.func.isRequired,
  updateOrderStatus: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  orders: state.orders.items,
  loading: state.orders.loading,
})

export default connect(mapStateToProps, { fetchOrders, updateOrderStatus })(Orders);
