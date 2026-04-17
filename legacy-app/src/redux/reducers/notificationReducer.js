var initialState = {
  items: [],
  loading: false,
  unreadCount: 0,
}

export default function notificationReducer(state, action) {
  if (typeof state === 'undefined') {
    state = initialState
  }

  switch (action.type) {
    case 'FETCH_NOTIFICATIONS_REQUEST':
      return Object.assign({}, state, {
        loading: true,
      })

    case 'FETCH_NOTIFICATIONS_SUCCESS':
      var unread = action.payload.filter(function(n) { return !n.read }).length
      return Object.assign({}, state, {
        items: action.payload,
        loading: false,
        unreadCount: unread,
      })

    case 'MARK_NOTIFICATION_READ':
      return Object.assign({}, state, {
        items: state.items.map(function(n) {
          if (n.id === action.payload) {
            return Object.assign({}, n, { read: true })
          }
          return n
        }),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return Object.assign({}, state, {
        items: state.items.map(function(n) {
          return Object.assign({}, n, { read: true })
        }),
        unreadCount: 0,
      })

    case 'DISMISS_NOTIFICATION':
      return Object.assign({}, state, {
        items: state.items.filter(function(n) {
          return n.id !== action.payload
        }),
      })

    case 'ADD_NOTIFICATION':
      return Object.assign({}, state, {
        items: [action.payload].concat(state.items),
        unreadCount: state.unreadCount + 1,
      })

    default:
      return state
  }
}
