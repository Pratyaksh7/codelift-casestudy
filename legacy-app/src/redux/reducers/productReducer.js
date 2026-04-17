var initialState = {
  items: [],
  loading: false,
  error: null,
};

export default function productReducer(state, action) {
  if (typeof state === 'undefined') {
    state = initialState;
  }

  switch (action.type) {
    case 'FETCH_PRODUCTS_REQUEST':
      return Object.assign({}, state, {
        loading: true,
      });

    case 'FETCH_PRODUCTS_SUCCESS':
      return Object.assign({}, state, {
        items: action.payload,
        loading: false,
        error: null,
      });

    case 'FETCH_PRODUCTS_FAILURE':
      return Object.assign({}, state, {
        loading: false,
        error: action.payload,
      });

    case 'DELETE_PRODUCT':
      return Object.assign({}, state, {
        items: state.items.filter(function(p) {
          return p.id !== action.payload;
        }),
      });

    default:
      return state;
  }
}
