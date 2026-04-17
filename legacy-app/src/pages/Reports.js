import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import $ from 'jquery';
import { fetchSalesReport } from '../redux/actions/analyticsActions';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';
import Chart from '../components/Chart';
import { getDateRange, formatDate } from '../utils/dateUtils';
import { formatCurrency, downloadCSV } from '../utils/helpers';
import './Reports.css';

class Reports extends Component {
  constructor(props) {
    super(props);

    var defaultRange = getDateRange('last30days');

    this.state = {
      startDate: defaultRange.startFormatted,
      endDate: defaultRange.endFormatted,
      quickRange: 'last30days',
      reportType: 'sales',
    };
  }

  componentDidMount() {
    console.log('[Reports] Component mounted');
    this.fetchReport();

    // animate stats on mount
    setTimeout(function() {
      $('.report-stat-value').each(function() {
        $(this).css('opacity', 0).animate({ opacity: 1 }, 600);
      });
    }, 300);
  }

  fetchReport() {
    var { startDate, endDate } = this.state;
    console.log('[Reports] Fetching report for', startDate, 'to', endDate);
    this.props.fetchSalesReport(startDate, endDate);
  }

  handleQuickRangeChange = (e) => {
    var range = getDateRange(e.target.value);
    this.setState({
      quickRange: e.target.value,
      startDate: range.startFormatted,
      endDate: range.endFormatted,
    }, function() {
      this.fetchReport();
    }.bind(this));
  }

  handleStartDateChange = (e) => {
    this.setState({ startDate: e.target.value, quickRange: 'custom' });
  }

  handleEndDateChange = (e) => {
    this.setState({ endDate: e.target.value, quickRange: 'custom' });
  }

  handleApplyFilter = () => {
    this.fetchReport();
  }

  handleExport = () => {
    var { salesReport } = this.props;
    console.log('[Reports] Exporting CSV with', salesReport.length, 'rows');

    // format data for CSV
    var csvData = salesReport.map(function(row) {
      return {
        Date: formatDate(row.date, 'YYYY-MM-DD'),
        Revenue: '$' + row.revenue.toFixed(2),
        Orders: row.orders,
        'Avg Order Value': '$' + (row.avgOrderValue || 0).toFixed(2),
      };
    });

    var filename = 'sales-report-' + this.state.startDate + '-to-' + this.state.endDate + '.csv';
    downloadCSV(csvData, filename);
  }

  getReportSummary() {
    var { salesReport } = this.props;
    if (!salesReport || salesReport.length === 0) {
      return { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, bestDay: 'N/A' };
    }

    var totalRevenue = salesReport.reduce(function(sum, r) { return sum + r.revenue; }, 0);
    var totalOrders = salesReport.reduce(function(sum, r) { return sum + r.orders; }, 0);
    var avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    var bestDay = salesReport.reduce(function(best, r) {
      return r.revenue > best.revenue ? r : best;
    }, salesReport[0]);

    return {
      totalRevenue: totalRevenue,
      totalOrders: totalOrders,
      avgOrderValue: avgOrderValue,
      bestDay: formatDate(bestDay.date, 'MMM DD, YYYY'),
      bestDayRevenue: bestDay.revenue,
    };
  }

  render() {
    var { salesReport, reportLoading } = this.props;
    var { startDate, endDate, quickRange } = this.state;
    var summary = this.getReportSummary();

    var breadcrumbItems = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Reports' },
    ];

    // prepare chart data
    var chartData = (salesReport || []).map(function(r) {
      return {
        label: moment(r.date).format('MM/DD'),
        value: r.revenue,
      };
    });

    // only show last 14 data points for the chart to keep it readable
    if (chartData.length > 14) {
      chartData = chartData.slice(chartData.length - 14);
    }

    var orderChartData = (salesReport || []).map(function(r) {
      return {
        label: moment(r.date).format('MM/DD'),
        value: r.orders,
      };
    });
    if (orderChartData.length > 14) {
      orderChartData = orderChartData.slice(orderChartData.length - 14);
    }

    return (
      <div className="reports-page">
        <Breadcrumb items={breadcrumbItems} />

        <div className="page-header">
          <h2>Sales Reports</h2>
          <p className="page-subtitle">View sales performance and generate reports</p>
        </div>

        <div className="reports-filters">
          <div className="reports-filters-left">
            <select className="filter-select" value={quickRange} onChange={this.handleQuickRangeChange}>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <div className="date-inputs">
              <input type="date" className="form-input" value={startDate} onChange={this.handleStartDateChange} style={{ width: 160 }} />
              <span style={{ color: '#888', padding: '0 8px' }}>to</span>
              <input type="date" className="form-input" value={endDate} onChange={this.handleEndDateChange} style={{ width: 160 }} />
            </div>
            <button className="btn btn-primary" onClick={this.handleApplyFilter}>Apply</button>
          </div>
          <button className="btn btn-success" onClick={this.handleExport} disabled={!salesReport || salesReport.length === 0}>
            Export CSV
          </button>
        </div>

        {reportLoading ? (
          <LoadingSpinner message="Generating report..." />
        ) : (
          <div>
            <div className="report-summary-grid">
              <div className="report-stat-card">
                <p className="report-stat-label">Total Revenue</p>
                <p className="report-stat-value">{formatCurrency(summary.totalRevenue)}</p>
              </div>
              <div className="report-stat-card">
                <p className="report-stat-label">Total Orders</p>
                <p className="report-stat-value">{summary.totalOrders.toLocaleString()}</p>
              </div>
              <div className="report-stat-card">
                <p className="report-stat-label">Avg Order Value</p>
                <p className="report-stat-value">{formatCurrency(summary.avgOrderValue)}</p>
              </div>
              <div className="report-stat-card">
                <p className="report-stat-label">Best Day</p>
                <p className="report-stat-value" style={{ fontSize: 16 }}>
                  {summary.bestDay}
                  {summary.bestDayRevenue && <span style={{ display: 'block', fontSize: 13, color: '#27ae60' }}>{formatCurrency(summary.bestDayRevenue)}</span>}
                </p>
              </div>
            </div>

            <div className="report-charts-grid">
              <Chart
                type="bar"
                title="Daily Revenue"
                data={chartData}
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

            <div className="report-table-section">
              <h3 style={{ marginBottom: 16, fontWeight: 600 }}>Detailed Report</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Revenue</th>
                    <th>Orders</th>
                    <th>Avg Order Value</th>
                  </tr>
                </thead>
                <tbody>
                  {salesReport && salesReport.length > 0 ? (
                    salesReport.slice(0, 20).map(function(row, index) {
                      return (
                        <tr key={index}>
                          <td style={{ fontWeight: 500 }}>{formatDate(row.date)}</td>
                          <td style={{ color: '#27ae60', fontWeight: 500 }}>{formatCurrency(row.revenue)}</td>
                          <td>{row.orders}</td>
                          <td>{formatCurrency(row.avgOrderValue || (row.orders > 0 ? row.revenue / row.orders : 0))}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: '#aaa', padding: 40 }}>
                        No report data available for the selected period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
}

Reports.propTypes = {
  salesReport: PropTypes.array,
  reportLoading: PropTypes.bool,
  fetchSalesReport: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  salesReport: state.analytics.salesReport,
  reportLoading: state.analytics.reportLoading,
});

export default connect(mapStateToProps, { fetchSalesReport })(Reports);
