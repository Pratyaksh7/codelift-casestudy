import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import $ from 'jquery';
import { fetchAnalyticsData, setAnalyticsDateRange } from '../redux/actions/analyticsActions';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';
import Chart from '../components/Chart';
import { getDateRange } from '../utils/dateUtils';
import { formatCurrency, formatNumber } from '../utils/helpers';
import './Analytics.css';

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPeriod: 'last30days',
    };
    // intentional memory leak: interval not cleaned up
    this.pollingInterval = null;
  }

  componentDidMount() {
    console.log('[Analytics] Component mounted');
    this.loadData();

    // poll for fresh data every 45 seconds - MEMORY LEAK
    var self = this;
    this.pollingInterval = setInterval(function() {
      console.log('[Analytics] Polling for fresh data...');
      self.loadData();
    }, 45000);

    // jQuery animation on stat cards
    setTimeout(function() {
      $('.analytics-stat-card').each(function(i) {
        $(this).css({ opacity: 0, transform: 'translateY(20px)' });
        $(this).delay(i * 100).animate({ opacity: 1 }, 400);
        // NOTE: jQuery animate doesn't handle transform, so this is incomplete
      });
    }, 200);
  }

  // intentionally not cleaning up interval
  // componentWillUnmount() {
  //   clearInterval(this.pollingInterval);
  // }

  loadData() {
    var range = getDateRange(this.state.selectedPeriod);
    this.props.fetchAnalyticsData(range);
  }

  handlePeriodChange = (e) => {
    var self = this;
    this.setState({ selectedPeriod: e.target.value }, function() {
      self.loadData();
    });
  }

  render() {
    var { analyticsData, loading } = this.props;
    var { selectedPeriod } = this.state;

    var breadcrumbItems = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Analytics' },
    ];

    if (loading || !analyticsData) {
      return (
        <div className="analytics-page">
          <Breadcrumb items={breadcrumbItems} />
          <LoadingSpinner fullPage={true} message="Loading analytics data..." />
        </div>
      );
    }

    // prepare chart data from analytics
    var revenueChartData = (analyticsData.daily || []).map(function(d) {
      return { label: moment(d.date).format('MM/DD'), value: d.revenue };
    });

    var orderChartData = (analyticsData.daily || []).map(function(d) {
      return { label: moment(d.date).format('MM/DD'), value: d.orders };
    });

    var monthlyChartData = (analyticsData.monthly || []).map(function(d) {
      return { label: d.month, value: d.revenue };
    });

    var categoryChartData = (analyticsData.topCategories || []).map(function(c) {
      return { label: c.name, value: c.percentage };
    });

    var topProductsData = (analyticsData.topProducts || []).map(function(p) {
      return { label: p.name.substring(0, 20), value: p.revenue };
    });

    var visitors = analyticsData.visitors || {};

    return (
      <div className="analytics-page">
        <Breadcrumb items={breadcrumbItems} />

        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Analytics</h2>
            <p className="page-subtitle">Track your store performance and growth</p>
          </div>
          <select className="filter-select" value={selectedPeriod} onChange={this.handlePeriodChange}>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>

        {/* Visitor Stats */}
        <div className="analytics-stats-grid">
          <div className="analytics-stat-card">
            <div className="analytics-stat-icon" style={{ backgroundColor: '#ebf5fb' }}>&#128101;</div>
            <div>
              <p className="analytics-stat-label">Total Visitors</p>
              <p className="analytics-stat-value">{formatNumber(visitors.total || 0)}</p>
            </div>
          </div>
          <div className="analytics-stat-card">
            <div className="analytics-stat-icon" style={{ backgroundColor: '#eafaf1' }}>&#128100;</div>
            <div>
              <p className="analytics-stat-label">Unique Visitors</p>
              <p className="analytics-stat-value">{formatNumber(visitors.unique || 0)}</p>
            </div>
          </div>
          <div className="analytics-stat-card">
            <div className="analytics-stat-icon" style={{ backgroundColor: '#fef9e7' }}>&#128200;</div>
            <div>
              <p className="analytics-stat-label">Bounce Rate</p>
              <p className="analytics-stat-value">{visitors.bounceRate || 0}%</p>
            </div>
          </div>
          <div className="analytics-stat-card">
            <div className="analytics-stat-icon" style={{ backgroundColor: '#f5eef8' }}>&#9201;</div>
            <div>
              <p className="analytics-stat-label">Avg. Session</p>
              <p className="analytics-stat-value">{Math.floor((visitors.avgSessionDuration || 0) / 60)}m {(visitors.avgSessionDuration || 0) % 60}s</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="analytics-charts-row">
          <Chart
            type="bar"
            title="Daily Revenue"
            data={revenueChartData}
            height={220}
            barColor="#4a90d9"
          />
          <Chart
            type="line"
            title="Daily Orders"
            data={orderChartData}
            height={220}
            lineColor="#27ae60"
          />
        </div>

        <div className="analytics-charts-row">
          <Chart
            type="bar"
            title="Monthly Revenue"
            data={monthlyChartData}
            height={220}
            barColor="#9b59b6"
          />
          <Chart
            type="donut"
            title="Sales by Category"
            data={categoryChartData}
            height={180}
          />
        </div>

        {/* Top Products Table */}
        <div className="analytics-section">
          <h3 style={{ marginBottom: 16, fontWeight: 600 }}>Top Products</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(analyticsData.topProducts || []).map(function(product, index) {
                return (
                  <tr key={index}>
                    <td style={{ fontWeight: 500, color: '#888' }}>{index + 1}</td>
                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                    <td>{product.sales}</td>
                    <td style={{ color: '#27ae60', fontWeight: 500 }}>{formatCurrency(product.revenue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Top Products Bar Chart */}
        <div style={{ marginTop: 20 }}>
          <Chart
            type="bar"
            title="Top Products by Revenue"
            data={topProductsData}
            height={200}
            barColor="#e67e22"
          />
        </div>
      </div>
    );
  }
}

Analytics.propTypes = {
  analyticsData: PropTypes.object,
  loading: PropTypes.bool,
  fetchAnalyticsData: PropTypes.func.isRequired,
  setAnalyticsDateRange: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  analyticsData: state.analytics.data,
  loading: state.analytics.loading,
});

export default connect(mapStateToProps, { fetchAnalyticsData, setAnalyticsDateRange })(Analytics);
