import axios from 'axios';

var mockCoupons = [
  { id: 1, code: 'WELCOME10', type: 'percentage', value: 10, minPurchase: 50, maxUses: 1000, usedCount: 342, status: 'active', startDate: '2022-01-01T00:00:00Z', endDate: '2022-06-30T23:59:59Z', description: 'Welcome discount for new customers' },
  { id: 2, code: 'WINTER20', type: 'percentage', value: 20, minPurchase: 100, maxUses: 500, usedCount: 189, status: 'active', startDate: '2022-01-01T00:00:00Z', endDate: '2022-02-28T23:59:59Z', description: 'Winter sale 20% off' },
  { id: 3, code: 'FREESHIP', type: 'free_shipping', value: 0, minPurchase: 75, maxUses: null, usedCount: 567, status: 'active', startDate: '2021-06-01T00:00:00Z', endDate: '2022-12-31T23:59:59Z', description: 'Free shipping on orders over $75' },
  { id: 4, code: 'SAVE15', type: 'fixed_amount', value: 15, minPurchase: 80, maxUses: 200, usedCount: 200, status: 'inactive', startDate: '2021-10-01T00:00:00Z', endDate: '2021-12-31T23:59:59Z', description: '$15 off orders over $80' },
  { id: 5, code: 'SUMMER25', type: 'percentage', value: 25, minPurchase: 150, maxUses: 300, usedCount: 0, status: 'scheduled', startDate: '2022-06-01T00:00:00Z', endDate: '2022-08-31T23:59:59Z', description: 'Summer sale 25% off' },
  { id: 6, code: 'VIP50', type: 'fixed_amount', value: 50, minPurchase: 200, maxUses: 50, usedCount: 12, status: 'active', startDate: '2022-01-01T00:00:00Z', endDate: '2022-12-31T23:59:59Z', description: 'VIP exclusive $50 off' },
  { id: 7, code: 'FLASH30', type: 'percentage', value: 30, minPurchase: 0, maxUses: 100, usedCount: 100, status: 'expired', startDate: '2021-11-26T00:00:00Z', endDate: '2021-11-26T23:59:59Z', description: 'Black Friday flash sale' },
  { id: 8, code: 'BOGO2022', type: 'bogo', value: 0, minPurchase: 0, maxUses: 250, usedCount: 78, status: 'active', startDate: '2022-01-15T00:00:00Z', endDate: '2022-03-15T23:59:59Z', description: 'Buy one get one free on selected items' },
];

export function fetchCoupons() {
  return function(dispatch) {
    dispatch({ type: 'FETCH_COUPONS_REQUEST' });

    axios.get('http://localhost:3001/api/coupons')
      .then(function(response) {
        console.log('coupons loaded:', response.data);
        dispatch({
          type: 'FETCH_COUPONS_SUCCESS',
          payload: response.data,
        });
      })
      .catch(function(error) {
        console.log('using mock coupon data');
        dispatch({
          type: 'FETCH_COUPONS_SUCCESS',
          payload: mockCoupons,
        });
      });
  };
}

export function createCoupon(couponData) {
  return function(dispatch) {
    dispatch({ type: 'CREATE_COUPON_REQUEST' });

    axios.post('http://localhost:3001/api/coupons', couponData)
      .then(function(res) {
        console.log('coupon created:', res.data);
        dispatch({
          type: 'CREATE_COUPON_SUCCESS',
          payload: res.data,
        });
      })
      .catch(function(err) {
        console.log('create coupon api failed, adding locally');
        var newCoupon = Object.assign({}, couponData, {
          id: Date.now(),
          usedCount: 0,
        });
        dispatch({
          type: 'CREATE_COUPON_SUCCESS',
          payload: newCoupon,
        });
      });
  }
}

export function updateCoupon(couponId, couponData) {
  return function(dispatch) {
    axios.put('http://localhost:3001/api/coupons/' + couponId, couponData)
      .then(function(res) {
        dispatch({
          type: 'UPDATE_COUPON_SUCCESS',
          payload: { id: couponId, data: res.data },
        });
      })
      .catch(function(err) {
        console.log('update coupon failed, updating locally');
        dispatch({
          type: 'UPDATE_COUPON_SUCCESS',
          payload: { id: couponId, data: Object.assign({ id: couponId }, couponData) },
        });
      });
  };
}

export function deleteCoupon(couponId) {
  return function(dispatch) {
    axios.delete('http://localhost:3001/api/coupons/' + couponId)
      .then(function() {
        dispatch({ type: 'DELETE_COUPON', payload: couponId });
      })
      .catch(function() {
        console.log('delete coupon api failed, removing locally');
        dispatch({ type: 'DELETE_COUPON', payload: couponId });
      })
  }
}

export function toggleCouponStatus(couponId, newStatus) {
  return function(dispatch) {
    dispatch({
      type: 'TOGGLE_COUPON_STATUS',
      payload: { id: couponId, status: newStatus },
    });

    // sync with server
    axios.patch('http://localhost:3001/api/coupons/' + couponId, { status: newStatus })
      .then(function() {
        console.log('coupon status updated on server');
      })
      .catch(function() {
        console.log('failed to sync coupon status');
        // TODO: should we revert?
      });
  };
}
