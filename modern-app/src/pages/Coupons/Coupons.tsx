import { useState } from 'react';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import type { BreadcrumbItem } from '../../components/Breadcrumb/Breadcrumb';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { CouponFormModal } from '../../components/CouponFormModal/CouponFormModal';
import {
  useCoupons,
  type Coupon,
  type CouponFormData,
  type CouponStatus,
  type StatusFilter,
} from '../../hooks/useCoupons';
import './Coupons.css';

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Coupons' },
];

const STATUS_COLORS: Record<CouponStatus, string> = {
  active: '#27ae60',
  inactive: '#95a5a6',
  expired: '#e74c3c',
  scheduled: '#9b59b6',
};

function formatCurrency(amount: number): string {
  return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function formatShortDate(iso: string): string {
  if (!iso) return 'N/A';
  const d = new Date(iso);
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const yy = String(d.getUTCFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

function capitalize(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function getCouponValueDisplay(coupon: Coupon): string {
  switch (coupon.type) {
    case 'percentage':
      return `${coupon.value}% Off`;
    case 'fixed_amount':
      return `${formatCurrency(coupon.value)} Off`;
    case 'free_shipping':
      return 'Free Shipping';
    case 'bogo':
      return 'Buy One Get One';
    default:
      return String(coupon.value);
  }
}

function getUsagePercent(coupon: Coupon): number {
  if (!coupon.maxUses) return 0;
  return Math.round((coupon.usedCount / coupon.maxUses) * 100);
}

function CouponStatusBadge({ status }: { status: CouponStatus }) {
  return (
    <span
      className="coupons-page__badge"
      style={{ backgroundColor: STATUS_COLORS[status] }}
    >
      {capitalize(status)}
    </span>
  );
}

function Coupons() {
  const {
    filteredCoupons,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
  } = useCoupons();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const openAddModal = () => {
    setEditingCoupon(null);
    setShowModal(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  const handleFormSubmit = async (data: CouponFormData) => {
    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, data);
      } else {
        await createCoupon(data);
      }
      closeModal();
    } catch {
      // error surfaced via the hook's error state; keep modal open for retry
    }
  };

  const openDeleteConfirm = (couponId: number) => {
    setDeleteTargetId(couponId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId !== null) {
      try {
        await deleteCoupon(deleteTargetId);
      } catch {
        // error surfaced via the hook's error state
      }
    }
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  return (
    <div className="coupons-page">
      <Breadcrumb items={BREADCRUMB_ITEMS} />

      <div className="coupons-page__header">
        <h2>Coupon Management</h2>
        <p className="coupons-page__subtitle">
          Create and manage discount coupons
        </p>
      </div>

      {error ? (
        <div className="coupons-page__error-banner" role="alert">
          {error}
        </div>
      ) : null}

      <div className="coupons-page__toolbar">
        <div className="coupons-page__toolbar-left">
          <input
            type="text"
            className="coupons-page__search"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="coupons-page__filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
        <button
          type="button"
          className="coupons-page__btn coupons-page__btn--primary"
          onClick={openAddModal}
        >
          + Create Coupon
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading coupons..." />
      ) : (
        <div className="coupons-page__grid">
          {filteredCoupons.length === 0 ? (
            <p className="coupons-page__empty">No coupons found.</p>
          ) : (
            filteredCoupons.map((coupon) => {
              const usagePercent = getUsagePercent(coupon);
              const fillColor = usagePercent >= 90 ? '#e74c3c' : '#4a90d9';
              return (
                <div key={coupon.id} className="coupons-page__card">
                  <div className="coupons-page__card-header">
                    <span className="coupons-page__code">{coupon.code}</span>
                    <CouponStatusBadge status={coupon.status} />
                  </div>
                  <div className="coupons-page__card-value">
                    {getCouponValueDisplay(coupon)}
                  </div>
                  <p className="coupons-page__card-desc">
                    {coupon.description}
                  </p>
                  <div className="coupons-page__card-details">
                    {coupon.minPurchase > 0 && (
                      <span className="coupons-page__detail">
                        Min: {formatCurrency(coupon.minPurchase)}
                      </span>
                    )}
                    <span className="coupons-page__detail">
                      {formatShortDate(coupon.startDate)} -{' '}
                      {formatShortDate(coupon.endDate)}
                    </span>
                  </div>
                  {coupon.maxUses ? (
                    <div className="coupons-page__usage">
                      <div className="coupons-page__usage-bar">
                        <div
                          className="coupons-page__usage-fill"
                          style={{
                            width: `${usagePercent}%`,
                            backgroundColor: fillColor,
                          }}
                        />
                      </div>
                      <span className="coupons-page__usage-text">
                        {coupon.usedCount}/{coupon.maxUses} used
                      </span>
                    </div>
                  ) : null}
                  <div className="coupons-page__card-actions">
                    <button
                      type="button"
                      className="coupons-page__btn coupons-page__btn--sm coupons-page__btn--primary"
                      onClick={() => openEditModal(coupon)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={
                        'coupons-page__btn coupons-page__btn--sm ' +
                        (coupon.status === 'active'
                          ? 'coupons-page__btn--warn'
                          : 'coupons-page__btn--success')
                      }
                      onClick={() => toggleCouponStatus(coupon)}
                    >
                      {coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      className="coupons-page__btn coupons-page__btn--sm coupons-page__btn--danger"
                      onClick={() => openDeleteConfirm(coupon.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {showModal && (
        <CouponFormModal
          editingCoupon={editingCoupon}
          onClose={closeModal}
          onSubmit={handleFormSubmit}
        />
      )}

      {showDeleteConfirm && (
        <div
          className="coupons-page__modal-overlay"
          onClick={handleDeleteCancel}
        >
          <div
            className="coupons-page__confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="coupons-page__confirm-icon">&#9888;</div>
            <h3 className="coupons-page__confirm-title">Delete Coupon</h3>
            <p className="coupons-page__confirm-message">
              Are you sure you want to delete this coupon? This action cannot
              be undone.
            </p>
            <div className="coupons-page__confirm-actions">
              <button
                type="button"
                className="coupons-page__btn coupons-page__btn--secondary"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="coupons-page__btn coupons-page__btn--danger"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Coupons;
