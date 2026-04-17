var initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  token: null,
};

export default function authReducer(state, action) {
  if (typeof state === 'undefined') {
    state = initialState;
  }

  switch (action.type) {
    case 'LOGIN_REQUEST':
      return Object.assign({}, state, {
        loading: true,
        error: null,
      });

    case 'LOGIN_SUCCESS':
      return Object.assign({}, state, {
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      });

    case 'LOGIN_FAILURE':
      return Object.assign({}, state, {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload,
      });

    case 'LOGOUT':
      return Object.assign({}, state, {
        isAuthenticated: false,
        user: null,
        token: null,
      });

    default:
      return state;
  }
}
