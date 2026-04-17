import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  EMPTY_COUPON_FORM,
  type Coupon,
  type CouponFormData,
  type CouponFormErrors,
} from '../../hooks/useCoupons';

export type CouponFormModalProps = {
  editingCoupon: Coupon | null;
  onClose: () => void;
  onSubmit: (data: CouponFormData) => void;
};

function toInputDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toISOString().slice(0, 10);
}

function couponToFormData(coupon: Coupon): CouponFormData {
  return {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value.toString(),
    minPurchase: coupon.minPurchase ? coupon.minPurchase.toString() : '',
    maxUses: coupon.maxUses ? coupon.maxUses.toString() : '',
    startDate: toInputDate(coupon.startDate),
    endDate: toInputDate(coupon.endDate),
    description: coupon.description || '',
    status: coupon.status,
  };
}

function validate(data: CouponFormData): CouponFormErrors {
  const errors: CouponFormErrors = {};
  if (!data.code || data.code.trim() === '') {
    errors.code = 'Code is required';
  }
  if (
    data.type !== 'free_shipping' &&
    data.type !== 'bogo' &&
    (!data.value || parseFloat(data.value) <= 0)
  ) {
    errors.value = 'Value is required';
  }
  if (!data.startDate) errors.startDate = 'Start date is required';
  if (!data.endDate) errors.endDate = 'End date is required';
  return errors;
}

export function CouponFormModal({
  editingCoupon,
  onClose,
  onSubmit,
}: CouponFormModalProps) {
  const [formData, setFormData] = useState<CouponFormData>(() =>
    editingCoupon ? couponToFormData(editingCoupon) : EMPTY_COUPON_FORM,
  );
  const [formErrors, setFormErrors] = useState<CouponFormErrors>({});

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    onSubmit(formData);
  };

  const valueDisabled =
    formData.type === 'free_shipping' || formData.type === 'bogo';

  return (
    <div className="coupons-page__modal-overlay" onClick={onClose}>
      <div
        className="coupons-page__modal coupons-page__modal--lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="coupons-page__modal-header">
          <h3>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
          <button
            type="button"
            className="coupons-page__modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="coupons-page__modal-body">
          <form onSubmit={handleSubmit}>
            <div className="coupons-page__form-row">
              <div className="coupons-page__form-group">
                <label htmlFor="coupon-code">Coupon Code</label>
                <input
                  id="coupon-code"
                  type="text"
                  name="code"
                  className="coupons-page__form-input coupons-page__form-input--upper"
                  value={formData.code}
                  onChange={handleFormChange}
                  placeholder="e.g. SAVE20"
                />
                {formErrors.code && (
                  <span className="coupons-page__field-error">
                    {formErrors.code}
                  </span>
                )}
              </div>
              <div className="coupons-page__form-group">
                <label htmlFor="coupon-type">Type</label>
                <select
                  id="coupon-type"
                  name="type"
                  className="coupons-page__form-input"
                  value={formData.type}
                  onChange={handleFormChange}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed_amount">Fixed Amount</option>
                  <option value="free_shipping">Free Shipping</option>
                  <option value="bogo">Buy One Get One</option>
                </select>
              </div>
            </div>

            <div className="coupons-page__form-row">
              <div className="coupons-page__form-group">
                <label htmlFor="coupon-value">
                  Value {formData.type === 'percentage' ? '(%)' : '($)'}
                </label>
                <input
                  id="coupon-value"
                  type="number"
                  name="value"
                  className="coupons-page__form-input"
                  step="0.01"
                  value={formData.value}
                  onChange={handleFormChange}
                  disabled={valueDisabled}
                />
                {formErrors.value && (
                  <span className="coupons-page__field-error">
                    {formErrors.value}
                  </span>
                )}
              </div>
              <div className="coupons-page__form-group">
                <label htmlFor="coupon-min">Min Purchase ($)</label>
                <input
                  id="coupon-min"
                  type="number"
                  name="minPurchase"
                  className="coupons-page__form-input"
                  step="0.01"
                  value={formData.minPurchase}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className="coupons-page__form-row">
              <div className="coupons-page__form-group">
                <label htmlFor="coupon-start">Start Date</label>
                <input
                  id="coupon-start"
                  type="date"
                  name="startDate"
                  className="coupons-page__form-input"
                  value={formData.startDate}
                  onChange={handleFormChange}
                />
                {formErrors.startDate && (
                  <span className="coupons-page__field-error">
                    {formErrors.startDate}
                  </span>
                )}
              </div>
              <div className="coupons-page__form-group">
                <label htmlFor="coupon-end">End Date</label>
                <input
                  id="coupon-end"
                  type="date"
                  name="endDate"
                  className="coupons-page__form-input"
                  value={formData.endDate}
                  onChange={handleFormChange}
                />
                {formErrors.endDate && (
                  <span className="coupons-page__field-error">
                    {formErrors.endDate}
                  </span>
                )}
              </div>
            </div>

            <div className="coupons-page__form-row">
              <div className="coupons-page__form-group">
                <label htmlFor="coupon-max">
                  Max Uses (leave empty for unlimited)
                </label>
                <input
                  id="coupon-max"
                  type="number"
                  name="maxUses"
                  className="coupons-page__form-input"
                  value={formData.maxUses}
                  onChange={handleFormChange}
                />
              </div>
              <div className="coupons-page__form-group">
                <label htmlFor="coupon-status">Status</label>
                <select
                  id="coupon-status"
                  name="status"
                  className="coupons-page__form-input"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            <div className="coupons-page__form-group">
              <label htmlFor="coupon-desc">Description</label>
              <textarea
                id="coupon-desc"
                name="description"
                className="coupons-page__form-input"
                rows={2}
                value={formData.description}
                onChange={handleFormChange}
              />
            </div>

            <div className="coupons-page__form-actions">
              <button
                type="button"
                className="coupons-page__btn coupons-page__btn--secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="coupons-page__btn coupons-page__btn--primary"
              >
                {editingCoupon ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CouponFormModal;
