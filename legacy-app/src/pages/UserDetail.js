import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import $ from 'jquery';
import { fetchUserById, fetchUserActivity } from '../redux/actions/userActions';
import Breadcrumb from '../components/Breadcrumb';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { ROLE_LABELS } from '../utils/constants';
import { formatDate, getRelativeTime } from '../utils/dateUtils';
import './UserDetail.css';

class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'overview',
    };
    // intentional: timer not cleaned up
    this.refreshTimer = null;
  }

  componentDidMount() {
    var userId = this.props.match.params.id;
    console.log('[UserDetail] Fetching user:', userId);

    this.props.fetchUserById(userId);
    this.props.fetchUserActivity(userId);

    // auto-refresh user data every 60 seconds - MEMORY LEAK: not cleared
    var self = this;
    this.refreshTimer = setInterval(function() {
      console.log('[UserDetail] Auto-refreshing user data...');
      self.props.fetchUserById(self.props.match.params.id);
    }, 60000);

    // jquery animation for page entry
    setTimeout(function() {
      $('.user-detail-page').css('opacity', 0).animate({ opacity: 1 }, 400);
    }, 50);
  }

  // NOTE: memory leak - not clearing refreshTimer in componentWillUnmount
  // componentWillUnmount() {
  //   clearInterval(this.refreshTimer);
  // }

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  }

  getActivityIcon(type) {
    switch(type) {
      case 'product': return '\uD83D\uDCE6';
      case 'order': return '\uD83D\uDCC3';
      case 'settings': return '\u2699';
      case 'coupon': return '\uD83C\uDF9F';
      case 'auth': return '\uD83D\uDD12';
      default: return '\u2022';
    }
  }

  renderOverviewTab() {
    var { user } = this.props;

    if (!user) return null;

    return (
      <div className="user-overview">
        <div className="user-info-grid">
          <div className="info-card">
            <h4 className="info-card-title">Contact Information</h4>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone</span>
              <span className="info-value">{user.phone || 'Not provided'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Role</span>
              <span className="info-value">
                <StatusBadge status={user.role} />
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Status</span>
              <span className="info-value">
                <StatusBadge status={user.status} />
              </span>
            </div>
          </div>

          <div className="info-card">
            <h4 className="info-card-title">Account Details</h4>
            <div className="info-row">
              <span className="info-label">User ID</span>
              <span className="info-value" style={{ fontFamily: 'monospace' }}>#{user.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Joined</span>
              <span className="info-value">{formatDate(user.joinDate)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Last Login</span>
              <span className="info-value">
                {user.lastLogin ? (
                  <span>
                    {formatDate(user.lastLogin)}
                    <br />
                    <span style={{ fontSize: 12, color: '#888' }}>{getRelativeTime(user.lastLogin)}</span>
                  </span>
                ) : 'Never logged in'}
              </span>
            </div>
          </div>
        </div>

        <div className="info-card" style={{ marginTop: 20 }}>
          <h4 className="info-card-title">Statistics</h4>
          <div className="user-stats-grid">
            <div className="user-stat">
              <span className="user-stat-number">24</span>
              <span className="user-stat-label">Orders Processed</span>
            </div>
            <div className="user-stat">
              <span className="user-stat-number">156</span>
              <span className="user-stat-label">Products Updated</span>
            </div>
            <div className="user-stat">
              <span className="user-stat-number">12</span>
              <span className="user-stat-label">Reports Generated</span>
            </div>
            <div className="user-stat">
              <span className="user-stat-number">89</span>
              <span className="user-stat-label">Actions This Month</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderActivityTab() {
    var { activityLog } = this.props;

    return (
      <div className="user-activity">
        <h4 style={{ marginBottom: 16, fontWeight: 600 }}>Recent Activity</h4>
        {activityLog.length === 0 ? (
          <p style={{ color: '#888', padding: 20 }}>No activity recorded.</p>
        ) : (
          <div className="activity-timeline">
            {activityLog.map(function(activity) {
              return (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{this.getActivityIcon(activity.type)}</div>
                  <div className="activity-content">
                    <p className="activity-action">{activity.action}</p>
                    <span className="activity-time">{getRelativeTime(activity.timestamp)}</span>
                  </div>
                </div>
              );
            }.bind(this))}
          </div>
        )}
      </div>
    );
  }

  render() {
    var { user, loading } = this.props;
    var { activeTab } = this.state;

    if (loading) {
      return <LoadingSpinner fullPage={true} message="Loading user details..." />;
    }

    if (!user) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h3 style={{ color: '#888' }}>User not found</h3>
          <Link to="/users" style={{ color: '#4a90d9' }}>Back to Users</Link>
        </div>
      );
    }

    var breadcrumbItems = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Users', path: '/users' },
      { label: user.name },
    ];

    return (
      <div className="user-detail-page">
        <Breadcrumb items={breadcrumbItems} />

        <div className="user-detail-header">
          <div className="user-detail-avatar" style={{ backgroundColor: '#4a90d9' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-detail-info">
            <h2>{user.name}</h2>
            <p style={{ color: '#888', fontSize: 14 }}>{user.email}</p>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <StatusBadge status={user.role} />
              <StatusBadge status={user.status} />
            </div>
          </div>
          <div className="user-detail-actions">
            <button className="btn btn-primary" onClick={function() { console.log('TODO: implement edit'); }}>Edit User</button>
            <Link to="/users" className="btn" style={{ background: '#eee', color: '#555', textDecoration: 'none' }}>Back to Users</Link>
          </div>
        </div>

        <div className="user-detail-tabs">
          <button
            className={'tab-btn' + (activeTab === 'overview' ? ' tab-active' : '')}
            onClick={function() { this.handleTabChange('overview'); }.bind(this)}
          >
            Overview
          </button>
          <button
            className={'tab-btn' + (activeTab === 'activity' ? ' tab-active' : '')}
            onClick={function() { this.handleTabChange('activity'); }.bind(this)}
          >
            Activity Log
          </button>
        </div>

        <div className="user-detail-content">
          {activeTab === 'overview' && this.renderOverviewTab()}
          {activeTab === 'activity' && this.renderActivityTab()}
        </div>
      </div>
    );
  }
}

UserDetail.propTypes = {
  user: PropTypes.object,
  activityLog: PropTypes.array,
  loading: PropTypes.bool,
  fetchUserById: PropTypes.func.isRequired,
  fetchUserActivity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.users.selectedUser,
  activityLog: state.users.activityLog,
  loading: state.users.detailLoading,
});

export default connect(mapStateToProps, { fetchUserById, fetchUserActivity })(UserDetail);
