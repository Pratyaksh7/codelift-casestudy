import axios from 'axios';

// mock user data
var mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@ecomdash.com', role: 'admin', status: 'active', phone: '555-0100', joinDate: '2020-03-15T00:00:00Z', lastLogin: '2022-01-15T10:30:00Z', avatar: null },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@ecomdash.com', role: 'manager', status: 'active', phone: '555-0101', joinDate: '2020-06-20T00:00:00Z', lastLogin: '2022-01-14T15:22:00Z', avatar: null },
  { id: 3, name: 'Mike Peters', email: 'mike@ecomdash.com', role: 'editor', status: 'active', phone: '555-0102', joinDate: '2021-01-10T00:00:00Z', lastLogin: '2022-01-13T09:45:00Z', avatar: null },
  { id: 4, name: 'Emily Davis', email: 'emily@ecomdash.com', role: 'viewer', status: 'active', phone: '555-0103', joinDate: '2021-03-25T00:00:00Z', lastLogin: '2022-01-12T14:18:00Z', avatar: null },
  { id: 5, name: 'Tom Wilson', email: 'tom@ecomdash.com', role: 'editor', status: 'inactive', phone: '555-0104', joinDate: '2021-05-15T00:00:00Z', lastLogin: '2021-12-20T11:00:00Z', avatar: null },
  { id: 6, name: 'Lisa Chen', email: 'lisa@ecomdash.com', role: 'manager', status: 'active', phone: '555-0105', joinDate: '2021-07-01T00:00:00Z', lastLogin: '2022-01-15T08:30:00Z', avatar: null },
  { id: 7, name: 'James Brown', email: 'james@ecomdash.com', role: 'viewer', status: 'pending', phone: '555-0106', joinDate: '2022-01-10T00:00:00Z', lastLogin: null, avatar: null },
  { id: 8, name: 'Maria Garcia', email: 'maria@ecomdash.com', role: 'editor', status: 'active', phone: '555-0107', joinDate: '2021-09-12T00:00:00Z', lastLogin: '2022-01-14T16:55:00Z', avatar: null },
  { id: 9, name: 'David Kim', email: 'david@ecomdash.com', role: 'viewer', status: 'active', phone: '555-0108', joinDate: '2021-11-05T00:00:00Z', lastLogin: '2022-01-11T10:20:00Z', avatar: null },
  { id: 10, name: 'Amanda White', email: 'amanda@ecomdash.com', role: 'manager', status: 'inactive', phone: '555-0109', joinDate: '2020-12-01T00:00:00Z', lastLogin: '2021-11-30T09:00:00Z', avatar: null },
];

var mockActivityLog = [
  { id: 1, userId: 1, action: 'Updated product #45', timestamp: '2022-01-15T10:30:00Z', type: 'product' },
  { id: 2, userId: 1, action: 'Approved order ORD-1024', timestamp: '2022-01-15T10:15:00Z', type: 'order' },
  { id: 3, userId: 1, action: 'Changed settings', timestamp: '2022-01-14T16:00:00Z', type: 'settings' },
  { id: 4, userId: 1, action: 'Added coupon WINTER20', timestamp: '2022-01-14T14:30:00Z', type: 'coupon' },
  { id: 5, userId: 1, action: 'Logged in', timestamp: '2022-01-14T09:00:00Z', type: 'auth' },
];

export function fetchUsers() {
  return function(dispatch) {
    dispatch({ type: 'FETCH_USERS_REQUEST' });

    axios.get('http://localhost:3001/api/users')
      .then(function(response) {
        console.log('fetched users:', response.data);
        dispatch({
          type: 'FETCH_USERS_SUCCESS',
          payload: response.data,
        });
      })
      .catch(function(error) {
        console.log('using mock user data');
        dispatch({
          type: 'FETCH_USERS_SUCCESS',
          payload: mockUsers,
        });
      });
  };
}

export function fetchUserById(userId) {
  return function(dispatch) {
    dispatch({ type: 'FETCH_USER_DETAIL_REQUEST' });

    axios.get('http://localhost:3001/api/users/' + userId)
      .then(function(response) {
        dispatch({
          type: 'FETCH_USER_DETAIL_SUCCESS',
          payload: response.data,
        });
      })
      .catch(function(err) {
        console.log('using mock user detail');
        var user = mockUsers.find(function(u) { return u.id === parseInt(userId); });
        dispatch({
          type: 'FETCH_USER_DETAIL_SUCCESS',
          payload: user || mockUsers[0],
        });
      });
  };
}

export function fetchUserActivity(userId) {
  return function(dispatch) {
    dispatch({ type: 'FETCH_USER_ACTIVITY_REQUEST' });

    axios.get('http://localhost:3001/api/users/' + userId + '/activity')
      .then(function(response) {
        dispatch({
          type: 'FETCH_USER_ACTIVITY_SUCCESS',
          payload: response.data,
        })
      })
      .catch(function(err) {
        console.log('using mock activity log');
        dispatch({
          type: 'FETCH_USER_ACTIVITY_SUCCESS',
          payload: mockActivityLog,
        });
      });
  }
}

export function createUser(userData) {
  return function(dispatch) {
    dispatch({ type: 'CREATE_USER_REQUEST' });

    axios.post('http://localhost:3001/api/users', userData)
      .then(function(res) {
        console.log('user created', res.data);
        dispatch({
          type: 'CREATE_USER_SUCCESS',
          payload: res.data,
        });
      })
      .catch(function(err) {
        console.log('create user failed, adding locally');
        var newUser = Object.assign({}, userData, {
          id: Date.now(),
          joinDate: new Date().toISOString(),
          lastLogin: null,
          status: 'pending',
        });
        dispatch({
          type: 'CREATE_USER_SUCCESS',
          payload: newUser,
        });
      });
  };
}

export function updateUser(userId, userData) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_USER_REQUEST' });

    axios.put('http://localhost:3001/api/users/' + userId, userData)
      .then(function(res) {
        dispatch({
          type: 'UPDATE_USER_SUCCESS',
          payload: { id: userId, data: res.data },
        });
      })
      .catch(function(err) {
        console.log('update user failed, updating locally');
        dispatch({
          type: 'UPDATE_USER_SUCCESS',
          payload: { id: userId, data: Object.assign({ id: userId }, userData) },
        });
      });
  };
}

export function deleteUser(userId) {
  return function(dispatch) {
    axios.delete('http://localhost:3001/api/users/' + userId)
      .then(function() {
        dispatch({ type: 'DELETE_USER', payload: userId });
      })
      .catch(function() {
        console.log('delete user api failed, removing locally');
        dispatch({ type: 'DELETE_USER', payload: userId });
      });
  };
}
