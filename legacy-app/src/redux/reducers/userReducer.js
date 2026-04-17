var initialState = {
  items: [],
  selectedUser: null,
  activityLog: [],
  loading: false,
  detailLoading: false,
  error: null,
};

export default function userReducer(state, action) {
  if (typeof state === 'undefined') {
    state = initialState;
  }

  switch (action.type) {
    case 'FETCH_USERS_REQUEST':
      return Object.assign({}, state, {
        loading: true,
        error: null,
      });

    case 'FETCH_USERS_SUCCESS':
      return Object.assign({}, state, {
        items: action.payload,
        loading: false,
      });

    case 'FETCH_USERS_FAILURE':
      return Object.assign({}, state, {
        loading: false,
        error: action.payload,
      });

    case 'FETCH_USER_DETAIL_REQUEST':
      return Object.assign({}, state, {
        detailLoading: true,
      });

    case 'FETCH_USER_DETAIL_SUCCESS':
      return Object.assign({}, state, {
        selectedUser: action.payload,
        detailLoading: false,
      });

    case 'FETCH_USER_ACTIVITY_REQUEST':
      return Object.assign({}, state, {
        activityLog: [],
      });

    case 'FETCH_USER_ACTIVITY_SUCCESS':
      return Object.assign({}, state, {
        activityLog: action.payload,
      });

    case 'CREATE_USER_SUCCESS':
      return Object.assign({}, state, {
        items: state.items.concat([action.payload]),
      });

    case 'UPDATE_USER_SUCCESS':
      return Object.assign({}, state, {
        items: state.items.map(function(user) {
          if (user.id === action.payload.id) {
            return Object.assign({}, user, action.payload.data);
          }
          return user;
        }),
      });

    case 'DELETE_USER':
      return Object.assign({}, state, {
        items: state.items.filter(function(u) {
          return u.id !== action.payload;
        }),
      });

    default:
      return state;
  }
}
