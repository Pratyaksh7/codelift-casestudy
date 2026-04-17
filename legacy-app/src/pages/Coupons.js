import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import $ from 'jquery';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } from '../redux/actions/couponActions';
import SearchBar from '../components/SearchBar';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';
import { COUPON_TYPES, COUPON_STATUS } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import { formatDate } from '../utils/dateUtils';
import './Coupons.css';

class Coupons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      statusFilter: 'all',
      showModal: false,
      showDeleteConfirm: false,
      deleteTargetId: null,
      editingCoupon: null,
      formData: {
        code: '',
        type: 'percentage',
        value: '',
        minPurchase: '',
        maxUses: '',
        startDate: '',
        endDate: '',
        description: '',
        status: 'active',
      },
      formErrors: {},
    };
  }

  componentDidMount() {
    console.log('[Coupons] Loading coupons');
    this.props.fetchCoupons();
  }

  handleSearch = (value) => {
    this.setState({ searchTerm: value });
  }

  handleStatusFilter = (e) => {
    this.setState({ statusFilter: e.target.value });
  }

  openAddModal = () => {
    this.setState({
      showModal: true,
      editingCoupon: null,
      formData: { code: '', type: 'percentage', value: '', minPurchase: '', maxUses: '', startDate: '', endDate: '', description: '', status: 'active' },
      formErrors: {},
    });
  }

  openEditModal = (coupon) => {
    console.log('editing coupon', coupon.id);
    this.setState({
      showModal: true,
      editingCoupon: coupon,
      formData: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value.toString(),
        minPurchase: coupon.minPurchase ? coupon.minPurchase.toString() : '',
        maxUses: coupon.maxUses ? coupon.maxUses.toString() : '',
        startDate: moment(coupon.startDate).format('YYYY-MM-DD'),
        endDate: moment(coupon.endDate).format('YYYY-MM-DD'),
        description: coupon.description || '',
        status: coupon.status,
      },
      formErrors: {},
    });
  }

  closeModal = () => {
    this.setState({ showModal: false, editingCoupon: null });
  }

  handleFormChange = (e) => {
    var formData = Object.assign({}, this.state.formData);
    formData[e.target.name] = e.target.value;
    this.setState({ formData: formData });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    var { formData, editingCoupon } = this.state;
    var errors = {};

    if (!formData.code || formData.code.trim() === '') errors.code = 'Code is required';
    if (formData.type !== 'free_shipping' && formData.type !== 'bogo' && (!formData.value || parseFloat(formData.value) <= 0)) {
      errors.value = 'Value is required';
    }
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';

    if (Object.keys(errors).length > 0) {
      this.setState({ formErrors: errors });
      return;
    }

    var payload = {
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value) || 0,
      minPurchase: parseFloat(formData.minPurchase) || 0,
      maxUses: parseInt(formData.maxUses) || null,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      description: formData.description,
      status: formData.status,
    };

    if (editingCoupon) {
      this.props.updateCoupon(editingCoupon.id, payload);
    } else {
      this.props.createCoupon(payload);
    }

    this.closeModal();
  }

  openDeleteConfirm = (couponId) => {
    this.setState({ showDeleteConfirm: true, deleteTargetId: couponId });
  }

  handleDeleteConfirm = () => {
    this.props.deleteCoupon(this.state.deleteTargetId);
    this.setState({ showDeleteConfirm: false, deleteTargetId: null });
  }

  handleToggleStatus = (coupon) => {
    var newStatus = coupon.status === 'active' ? 'inactive' : 'active';
    this.props.toggleCouponStatus(coupon.id, newStatus);
  }

  getFilteredCoupons() {
    var { searchTerm, statusFilter } = this.state;
    var coupons = this.props.coupons;

    if (searchTerm) {
      var term = searchTerm.toLowerCase();
      coupons = coupons.filter(function(c) {
        return c.code.toLowerCase().indexOf(term) !== -1 ||
               (c.description || '').toLowerCase().indexOf(term) !== -1;
      });
    }

    if (statusFilter !== 'all') {
      coupons = coupons.filter(function(c) { return c.status === statusFilter; });
    }

    return coupons;
  }

  getCouponValueDisplay(coupon) {
    switch(coupon.type) {
      case 'percentage': return coupon.value + '% Off';
      case 'fixed_amount': return formatCurrency(coupon.value) + ' Off';
      case 'free_shipping': return 'Free Shipping';
      case 'bogo': return 'Buy One Get One';
      default: return coupon.value;
    }
  }

  getUsagePercent(coupon) {
    if (!coupon.maxUses) return 0;
    return Math.round((coupon.usedCount / coupon.maxUses) * 100);
  }

  render() {
    var { loading } = this.props;
    var { showModal, showDeleteConfirm, editingCoupon, formData, formErrors, statusFilter } = this.state;
    var filteredCoupons = this.getFilteredCoupons();

    var breadcrumbItems = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Coupons' },
    ];

    return (
      <div className="coupons-page">
        <Breadcrumb items={breadcrumbItems} />

        <div className="page-header">
          <h2>Coupon Management</h2>
          <p className="page-subtitle">Create and manage discount coupons</p>
        </div>

        <div className="coupons-toolbar">
          <div className="coupons-toolbar-left">
            <SearchBar placeholder="Search coupons..." onChange={this.handleSearch} instant={true} />
            <select className="filter-select" value={statusFilter} onChange={this.handleStatusFilter}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={this.openAddModal}>+ Create Coupon</button>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading coupons..." />
        ) : (
          <div className="coupons-grid">
            {filteredCoupons.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: 40, gridColumn: '1 / -1' }}>No coupons found.</p>
            ) : (
              filteredCoupons.map(function(coupon) {
                var usagePercent = this.getUsagePercent(coupon);

                return (
                  <div key={coupon.id} className="coupon-card">
                    <div className="coupon-card-header">
                      <span className="coupon-code">{coupon.code}</span>
                      <StatusBadge status={coupon.status} size="small" />
                    </div>
                    <div className="coupon-card-value">{this.getCouponValueDisplay(coupon)}</div>
                    <p className="coupon-card-desc">{coupon.description}</p>
                    <div className="coupon-card-details">
                      {coupon.minPurchase > 0 && (
                        <span className="coupon-detail">Min: {formatCurrency(coupon.minPurchase)}</span>
                      )}
                      <span className="coupon-detail">
                        {formatDate(coupon.startDate, 'MM/DD/YY')} - {formatDate(coupon.endDate, 'MM/DD/YY')}
                      </span>
                    </div>
                    {coupon.maxUses && (
                      <div className="coupon-usage">
                        <div className="coupon-usage-bar">
                          <div className="coupon-usage-fill" style={{ width: usagePercent + '%', backgroundColor: usagePercent >= 90 ? '#e74c3c' : '#4a90d9' }}></div>
                        </div>
                        <span className="coupon-usage-text">{coupon.usedCount}/{coupon.maxUses} used</span>
                      </div>
                    )}
                    <div className="coupon-card-actions">
                      <button className="btn btn-sm btn-primary" onClick={function() { this.openEditModal(coupon); }.bind(this)}>Edit</button>
                      <button className="btn btn-sm" style={{ background: coupon.status === 'active' ? '#f39c12' : '#27ae60', color: 'white' }} onClick={function() { this.handleToggleStatus(coupon); }.bind(this)}>
                        {coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={function() { this.openDeleteConfirm(coupon.id); }.bind(this)}>Delete</button>
                    </div>
                  </div>
                );
              }.bind(this))
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal isOpen={showModal} onClose={this.closeModal} title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'} size="large" showFooter={false}>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Coupon Code</label>
                <input type="text" name="code" className="form-input" value={formData.code} onChange={this.handleFormChange} placeholder="e.g. SAVE20" style={{ textTransform: 'uppercase' }} />
                {formErrors.code && <span className="field-error">{formErrors.code}</span>}
              </div>
              <div className="form-group">
                <label>Type</label>
                <select name="type" className="form-input" value={formData.type} onChange={this.handleFormChange}>
                  <option value="percentage">Percentage</option>
                  <option value="fixed_amount">Fixed Amount</option>
                  <option value="free_shipping">Free Shipping</option>
                  <option value="bogo">Buy One Get One</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Value {formData.type === 'percentage' ? '(%)' : '($)'}</label>
                <input type="number" name="value" className="form-input" step="0.01" value={formData.value} onChange={this.handleFormChange} disabled={formData.type === 'free_shipping' || formData.type === 'bogo'} />
                {formErrors.value && <span className="field-error">{formErrors.value}</span>}
              </div>
              <div className="form-group">
                <label>Min Purchase ($)</label>
                <input type="number" name="minPurchase" className="form-input" step="0.01" value={formData.minPurchase} onChange={this.handleFormChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" name="startDate" className="form-input" value={formData.startDate} onChange={this.handleFormChange} />
                {formErrors.startDate && <span className="field-error">{formErrors.startDate}</span>}
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" name="endDate" className="form-input" value={formData.endDate} onChange={this.handleFormChange} />
                {formErrors.endDate && <span className="field-error">{formErrors.endDate}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Max Uses (leave empty for unlimited)</label>
                <input type="number" name="maxUses" className="form-input" value={formData.maxUses} onChange={this.handleFormChange} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" className="form-input" value={formData.status} onChange={this.handleFormChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" className="form-input" rows="2" value={formData.description} onChange={this.handleFormChange}></textarea>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button type="button" className="btn" style={{ background: '#eee', color: '#555' }} onClick={this.closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingCoupon ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </Modal>

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onConfirm={this.handleDeleteConfirm}
          onCancel={function() { this.setState({ showDeleteConfirm: false }); }.bind(this)}
          title="Delete Coupon"
          message="Are you sure you want to delete this coupon? This action cannot be undone."
          type="danger"
          confirmText="Delete"
        />
      </div>
    );
  }
}

Coupons.propTypes = {
  coupons: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  fetchCoupons: PropTypes.func.isRequired,
  createCoupon: PropTypes.func.isRequired,
  updateCoupon: PropTypes.func.isRequired,
  deleteCoupon: PropTypes.func.isRequired,
  toggleCouponStatus: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  coupons: state.coupons.items,
  loading: state.coupons.loading,
});

export default connect(mapStateToProps, { fetchCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCouponStatus })(Coupons);
