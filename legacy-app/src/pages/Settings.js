import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import $ from 'jquery';
import {
  fetchSettings,
  updateProfileSettings,
  updateNotificationSettings,
  updateSecuritySettings,
} from '../redux/actions/settingsActions';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import FileUpload from '../components/FileUpload';
import { validateEmail, validatePhone, validateRequired } from '../utils/validators';
import './Settings.css';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'profile',
      profileForm: {},
      notifForm: {},
      securityForm: {},
      toast: null,
      formErrors: {},
      hasChanges: false,
    };
  }

  componentDidMount() {
    console.log('[Settings] Loading settings');
    this.props.fetchSettings();
  }

  componentDidUpdate(prevProps) {
    // populate forms when settings load
    if (prevProps.loading && !this.props.loading) {
      this.setState({
        profileForm: Object.assign({}, this.props.profile),
        notifForm: Object.assign({}, this.props.notifications),
        securityForm: Object.assign({}, this.props.security),
      });
    }

    // show success toast after save
    if (prevProps.saving && !this.props.saving) {
      this.showToast('Settings saved successfully', 'success');
    }
  }

  showToast(message, type) {
    this.setState({ toast: { message: message, type: type } });
    var self = this;
    setTimeout(function() {
      self.setState({ toast: null });
    }, 3000);
  }

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab, formErrors: {} });
  }

  handleProfileChange = (e) => {
    var form = Object.assign({}, this.state.profileForm);
    form[e.target.name] = e.target.value;
    this.setState({ profileForm: form, hasChanges: true });
  }

  handleNotifChange = (e) => {
    var form = Object.assign({}, this.state.notifForm);
    form[e.target.name] = e.target.checked;
    this.setState({ notifForm: form, hasChanges: true });
  }

  handleSecurityChange = (e) => {
    var form = Object.assign({}, this.state.securityForm);
    var val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    form[e.target.name] = val;
    this.setState({ securityForm: form, hasChanges: true });
  }

  handleProfileSave = (e) => {
    e.preventDefault();
    var { profileForm } = this.state;
    var errors = {};

    if (!validateRequired(profileForm.companyName)) errors.companyName = 'Company name is required';
    if (!validateEmail(profileForm.email)) errors.email = 'Valid email is required';

    if (Object.keys(errors).length > 0) {
      this.setState({ formErrors: errors });
      return;
    }

    console.log('[Settings] Saving profile settings');
    this.props.updateProfileSettings(profileForm);
    this.setState({ hasChanges: false, formErrors: {} });
  }

  handleNotifSave = () => {
    console.log('[Settings] Saving notification settings');
    this.props.updateNotificationSettings(this.state.notifForm);
    this.setState({ hasChanges: false });
  }

  handleSecuritySave = () => {
    console.log('[Settings] Saving security settings');
    this.props.updateSecuritySettings(this.state.securityForm);
    this.setState({ hasChanges: false });
  }

  renderProfileTab() {
    var { profileForm, formErrors } = this.state;

    return (
      <form onSubmit={this.handleProfileSave} className="settings-form">
        <div className="form-group">
          <label>Company Name</label>
          <input type="text" name="companyName" className="form-input" value={profileForm.companyName || ''} onChange={this.handleProfileChange} />
          {formErrors.companyName && <span className="field-error">{formErrors.companyName}</span>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-input" value={profileForm.email || ''} onChange={this.handleProfileChange} />
            {formErrors.email && <span className="field-error">{formErrors.email}</span>}
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" className="form-input" value={profileForm.phone || ''} onChange={this.handleProfileChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea name="address" className="form-input" rows="2" value={profileForm.address || ''} onChange={this.handleProfileChange}></textarea>
        </div>
        <div className="form-group">
          <label>Website</label>
          <input type="url" name="website" className="form-input" value={profileForm.website || ''} onChange={this.handleProfileChange} placeholder="https://" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Timezone</label>
            <select name="timezone" className="form-input" value={profileForm.timezone || ''} onChange={this.handleProfileChange}>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div className="form-group">
            <label>Currency</label>
            <select name="currency" className="form-input" value={profileForm.currency || ''} onChange={this.handleProfileChange}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (&euro;)</option>
              <option value="GBP">GBP (&pound;)</option>
            </select>
          </div>
        </div>
        <FileUpload
          label="Company Logo"
          accept="image/*"
          showUploadButton={false}
        />
        <div className="settings-actions">
          <button type="submit" className="btn btn-primary">Save Profile</button>
        </div>
      </form>
    );
  }

  renderNotificationsTab() {
    var { notifForm } = this.state;

    var notifItems = [
      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
      { key: 'orderAlerts', label: 'Order Alerts', desc: 'Get notified when new orders arrive' },
      { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Alert when product stock is low' },
      { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly summary report' },
      { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional emails' },
      { key: 'securityAlerts', label: 'Security Alerts', desc: 'Important security notifications' },
      { key: 'newUserAlerts', label: 'New User Alerts', desc: 'Notify when new users register' },
      { key: 'systemUpdates', label: 'System Updates', desc: 'Notifications about system updates' },
    ];

    return (
      <div className="settings-form">
        <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
          Manage which notifications you receive. Some critical notifications cannot be disabled.
        </p>
        {notifItems.map(function(item) {
          return (
            <div key={item.key} className="notif-toggle-row">
              <div className="notif-toggle-info">
                <span className="notif-toggle-label">{item.label}</span>
                <span className="notif-toggle-desc">{item.desc}</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name={item.key}
                  checked={notifForm[item.key] || false}
                  onChange={this.handleNotifChange}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          );
        }.bind(this))}
        <div className="settings-actions">
          <button type="button" className="btn btn-primary" onClick={this.handleNotifSave}>Save Notifications</button>
        </div>
      </div>
    );
  }

  renderSecurityTab() {
    var { securityForm } = this.state;

    return (
      <div className="settings-form">
        <div className="notif-toggle-row">
          <div className="notif-toggle-info">
            <span className="notif-toggle-label">Two-Factor Authentication</span>
            <span className="notif-toggle-desc">Add an extra layer of security to your account</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" name="twoFactorEnabled" checked={securityForm.twoFactorEnabled || false} onChange={this.handleSecurityChange} />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="form-group" style={{ marginTop: 20 }}>
          <label>Session Timeout (minutes)</label>
          <input type="number" name="sessionTimeout" className="form-input" value={securityForm.sessionTimeout || 30} onChange={this.handleSecurityChange} min="5" max="480" style={{ width: 120 }} />
        </div>
        <div className="form-group">
          <label>Password Expiry (days)</label>
          <input type="number" name="passwordExpiry" className="form-input" value={securityForm.passwordExpiry || 90} onChange={this.handleSecurityChange} min="30" max="365" style={{ width: 120 }} />
          <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            Last changed: {this.props.security.lastPasswordChange ? new Date(this.props.security.lastPasswordChange).toLocaleDateString() : 'Unknown'}
          </p>
        </div>
        <div className="form-group">
          <label>IP Whitelist</label>
          <textarea name="ipWhitelist" className="form-input" rows="3" value={securityForm.ipWhitelist || ''} onChange={this.handleSecurityChange} placeholder="Enter IP addresses, one per line"></textarea>
          <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Leave empty to allow all IPs</p>
        </div>

        <div style={{ background: '#fef9e7', border: '1px solid #fdeaa7', padding: 16, borderRadius: 8, marginTop: 20, marginBottom: 20 }}>
          <h4 style={{ color: '#856404', marginBottom: 8, fontSize: 14 }}>Danger Zone</h4>
          <p style={{ fontSize: 13, color: '#856404', marginBottom: 12 }}>These actions are irreversible. Please be careful.</p>
          <button className="btn btn-danger btn-sm" onClick={function() { console.log('TODO: implement password reset'); }}>
            Reset Password
          </button>
          <button className="btn btn-sm" style={{ marginLeft: 8, background: '#eee', color: '#555' }} onClick={function() { console.log('TODO: implement session kill'); }}>
            Terminate All Sessions
          </button>
        </div>

        <div className="settings-actions">
          <button type="button" className="btn btn-primary" onClick={this.handleSecuritySave}>Save Security Settings</button>
        </div>
      </div>
    );
  }

  render() {
    var { loading } = this.props;
    var { activeTab, toast } = this.state;

    if (loading) {
      return <LoadingSpinner fullPage={true} message="Loading settings..." />;
    }

    var breadcrumbItems = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Settings' },
    ];

    return (
      <div className="settings-page">
        <Breadcrumb items={breadcrumbItems} />

        <div className="page-header">
          <h2>Settings</h2>
          <p className="page-subtitle">Configure your application preferences</p>
        </div>

        {toast && <Toast message={toast.message} type={toast.type} onClose={function() { this.setState({ toast: null }); }.bind(this)} />}

        <div className="settings-layout">
          <div className="settings-sidebar">
            <button className={'settings-tab-btn' + (activeTab === 'profile' ? ' active' : '')} onClick={function() { this.handleTabChange('profile'); }.bind(this)}>
              <span style={{ marginRight: 8 }}>&#128100;</span> Profile
            </button>
            <button className={'settings-tab-btn' + (activeTab === 'notifications' ? ' active' : '')} onClick={function() { this.handleTabChange('notifications'); }.bind(this)}>
              <span style={{ marginRight: 8 }}>&#128276;</span> Notifications
            </button>
            <button className={'settings-tab-btn' + (activeTab === 'security' ? ' active' : '')} onClick={function() { this.handleTabChange('security'); }.bind(this)}>
              <span style={{ marginRight: 8 }}>&#128274;</span> Security
            </button>
          </div>
          <div className="settings-content">
            {activeTab === 'profile' && this.renderProfileTab()}
            {activeTab === 'notifications' && this.renderNotificationsTab()}
            {activeTab === 'security' && this.renderSecurityTab()}
          </div>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  profile: PropTypes.object,
  notifications: PropTypes.object,
  security: PropTypes.object,
  loading: PropTypes.bool,
  saving: PropTypes.bool,
  fetchSettings: PropTypes.func.isRequired,
  updateProfileSettings: PropTypes.func.isRequired,
  updateNotificationSettings: PropTypes.func.isRequired,
  updateSecuritySettings: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.settings.profile,
  notifications: state.settings.notifications,
  security: state.settings.security,
  loading: state.settings.loading,
  saving: state.settings.saving,
});

export default connect(mapStateToProps, {
  fetchSettings,
  updateProfileSettings,
  updateNotificationSettings,
  updateSecuritySettings,
})(Settings);
