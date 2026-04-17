var initialState = {
  items: [],
  loading: false,
  error: null,
};

export default function couponReducer(state, action) {
  if (typeof state === 'undefined') {
    state = initialState;
  }

  switch (action.type) {
    case 'FETCH_COUPONS_REQUEST':
      return Object.assign({}, state, {
        loading: true,
        error: null,
      });

    case 'FETCH_COUPONS_SUCCESS':
      return Object.assign({}, state, {
        items: action.payload,
        loading: false,
      });

    case 'FETCH_COUPONS_FAILURE':
      return Object.assign({}, state, {
        loading: false,
        error: action.payload,
      });

    case 'CREATE_COUPON_SUCCESS':
      return Object.assign({}, state, {
        items: state.items.concat([action.payload]),
      });

    case 'UPDATE_COUPON_SUCCESS':
      return Object.assign({}, state, {
        items: state.items.map(function(coupon) {
          if (coupon.id === action.payload.id) {
            return Object.assign({}, coupon, action.payload.data);
          }
          return coupon;
        }),
      });

    case 'DELETE_COUPON':
      return Object.assign({}, state, {
        items: state.items.filter(function(c) {
          return c.id !== action.payload;
        }),
      });

    case 'TOGGLE_COUPON_STATUS':
      return Object.assign({}, state, {
        items: state.items.map(function(coupon) {
          if (coupon.id === action.payload.id) {
            return Object.assign({}, coupon, { status: action.payload.status });
          }
          return coupon;
        }),
      });

    default:
      return state;
  }
}
