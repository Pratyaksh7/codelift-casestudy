var initialState = {
  items: [],
  loading: false,
  error: null,
}

export default function orderReducer(state, action) {
  if (typeof state === 'undefined') {
    state = initialState
  }

  switch (action.type) {
    case 'FETCH_ORDERS_REQUEST':
      return Object.assign({}, state, {
        loading: true,
      })

    case 'FETCH_ORDERS_SUCCESS':
      return Object.assign({}, state, {
        items: action.payload,
        loading: false,
        error: null,
      })

    case 'FETCH_ORDERS_FAILURE':
      return Object.assign({}, state, {
        loading: false,
        error: action.payload,
      })

    case 'UPDATE_ORDER_STATUS':
      return Object.assign({}, state, {
        items: state.items.map(function(order) {
          if (order.id === action.payload.orderId) {
            return Object.assign({}, order, { status: action.payload.status })
          }
          return order
        }),
      })

    default:
      return state
  }
}
