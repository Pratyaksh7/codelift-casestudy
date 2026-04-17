import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import $ from 'jquery';
import './Dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: {
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
      },
      recentOrders: [],
      loading: true,
      chartLoaded: false,
    };
  }

  componentDidMount() {
    this.fetchDashboardData();
    this.animateCounters();
  }

  // TODO: replace with a proper charting library
  animateCounters() {
    var self = this;
    setTimeout(function() {
      // using jquery to animate the stat numbers
      $('.stat-number').each(function() {
        var $this = $(this);
        var target = parseInt($this.attr('data-target')) || 0;
        $({ count: 0 }).animate({ count: target }, {
          duration: 1000,
          step: function() {
            $this.text(Math.floor(this.count).toLocaleString());
          },
          complete: function() {
            $this.text(target.toLocaleString());
          }
        });
      });
    }, 500);
  }

  fetchDashboardData() {
    var self = this;

    // hardcoded api url - TODO: move to env
    axios.get('http://localhost:3001/api/dashboard/stats')
      .then(function(response) {
        console.log('dashboard data:', response.data);
        self.setState({
          stats: response.data.stats,
          recentOrders: response.data.recentOrders,
          loading: false,
        });
      })
      .catch(function(error) {
        console.log('API not available, using mock data');
        // fallback mock data for demo
        self.setState({
          stats: {
            totalSales: 124750,
            totalOrders: 356,
            totalProducts: 89,
            totalCustomers: 1240,
          },
          recentOrders: [
            { id: 'ORD-1024', customer: 'John Doe', total: 299.99, status: 'completed', date: '2022-01-15T10:30:00Z' },
            { id: 'ORD-1023', customer: 'Jane Smith', total: 149.50, status: 'processing', date: '2022-01-15T09:15:00Z' },
            { id: 'ORD-1022', customer: 'Bob Johnson', total: 89.99, status: 'shipped', date: '2022-01-14T16:45:00Z' },
            { id: 'ORD-1021', customer: 'Alice Brown', total: 450.00, status: 'completed', date: '2022-01-14T14:20:00Z' },
            { id: 'ORD-1020', customer: 'Charlie Wilson', total: 67.25, status: 'pending', date: '2022-01-14T11:00:00Z' },
          ],
          loading: false,
        });
      });
  }

  getStatusBadge(status) {
    var colors = {
      completed: '#27ae60',
      processing: '#f39c12',
      shipped: '#3498db',
      pending: '#95a5a6',
      cancelled: '#e74c3c',
    };

    return (
      <span style={{
        backgroundColor: colors[status] || '#95a5a6',
        color: 'white',
        padding: '4px 10px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 500,
        textTransform: 'capitalize'
      }}>
        {status}
      </span>
    );
  }

  render() {
    const { stats, recentOrders, loading } = this.state;

    if (loading) {
      return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
          <p style={{color: '#888', fontSize: 16}}>Loading dashboard...</p>
        </div>
      );
    }

    return (
      <div className="dashboard">
        <div className="page-header">
          <h2>Dashboard</h2>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{backgroundColor: '#ebf5fb'}}>
              <span style={{fontSize: 24}}>&#128176;</span>
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Sales</p>
              <h3 className="stat-number" data-target={stats.totalSales}>
                ${stats.totalSales.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{backgroundColor: '#fef9e7'}}>
              <span style={{fontSize: 24}}>&#128230;</span>
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Orders</p>
              <h3 className="stat-number" data-target={stats.totalOrders}>
                {stats.totalOrders.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{backgroundColor: '#eafaf1'}}>
              <span style={{fontSize: 24}}>&#128722;</span>
            </div>
            <div className="stat-info">
              <p className="stat-label">Products</p>
              <h3 className="stat-number" data-target={stats.totalProducts}>
                {stats.totalProducts}
              </h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{backgroundColor: '#f5eef8'}}>
              <span style={{fontSize: 24}}>&#128101;</span>
            </div>
            <div className="stat-info">
              <p className="stat-label">Customers</p>
              <h3 className="stat-number" data-target={stats.totalCustomers}>
                {stats.totalCustomers.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h3 style={{marginBottom: 16, fontWeight: 600}}>Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(function(order) {
                return (
                  <tr key={order.id}>
                    <td style={{fontWeight: 500, color: '#4a90d9'}}>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>{this.getStatusBadge(order.status)}</td>
                    <td style={{color: '#888'}}>{moment(order.date).format('MMM DD, YYYY h:mm A')}</td>
                  </tr>
                );
              }.bind(this))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Dashboard);
