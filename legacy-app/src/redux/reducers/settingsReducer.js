var initialState = {
  profile: {},
  notifications: {},
  security: {},
  loading: false,
  saving: false,
  error: null,
}

export default function settingsReducer(state, action) {
  if (typeof state === 'undefined') {
    state = initialState
  }

  switch (action.type) {
    case 'FETCH_SETTINGS_REQUEST':
      return Object.assign({}, state, {
        loading: true,
      })

    case 'FETCH_SETTINGS_SUCCESS':
      return Object.assign({}, state, {
        profile: action.payload.profile || {},
        notifications: action.payload.notifications || {},
        security: action.payload.security || {},
        loading: false,
      })

    case 'UPDATE_SETTINGS_REQUEST':
      return Object.assign({}, state, {
        saving: true,
      })

    case 'UPDATE_PROFILE_SETTINGS_SUCCESS':
      return Object.assign({}, state, {
        profile: Object.assign({}, state.profile, action.payload),
        saving: false,
      })

    case 'UPDATE_NOTIFICATION_SETTINGS_SUCCESS':
      return Object.assign({}, state, {
        notifications: Object.assign({}, state.notifications, action.payload),
        saving: false,
      })

    case 'UPDATE_SECURITY_SETTINGS_SUCCESS':
      return Object.assign({}, state, {
        security: Object.assign({}, state.security, action.payload),
        saving: false,
      })

    default:
      return state
  }
}
