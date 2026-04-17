var initialState = {
  data: null,
  salesReport: [],
  dateRange: {
    start: null,
    end: null,
  },
  loading: false,
  reportLoading: false,
  error: null,
}

export default function analyticsReducer(state, action) {
  if (typeof state === 'undefined') {
    state = initialState
  }

  switch (action.type) {
    case 'FETCH_ANALYTICS_REQUEST':
      return Object.assign({}, state, {
        loading: true,
        error: null,
      })

    case 'FETCH_ANALYTICS_SUCCESS':
      return Object.assign({}, state, {
        data: action.payload,
        loading: false,
      })

    case 'FETCH_ANALYTICS_FAILURE':
      return Object.assign({}, state, {
        loading: false,
        error: action.payload,
      })

    case 'FETCH_SALES_REPORT_REQUEST':
      return Object.assign({}, state, {
        reportLoading: true,
      })

    case 'FETCH_SALES_REPORT_SUCCESS':
      return Object.assign({}, state, {
        salesReport: action.payload,
        reportLoading: false,
      })

    case 'SET_ANALYTICS_DATE_RANGE':
      return Object.assign({}, state, {
        dateRange: action.payload,
      })

    default:
      return state
  }
}
