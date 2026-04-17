import axios from 'axios';

export function login(email, password) {
  return function(dispatch) {
    dispatch({ type: 'LOGIN_REQUEST' });

    // hardcoded API url - TODO: use environment variables
    axios.post('http://localhost:3001/api/auth/login', {
      email: email,
      password: password,
    })
    .then(function(response) {
      console.log('login response:', response.data);
      var data = response.data;

      // save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: data,
      });
    })
    .catch(function(error) {
      console.log('login api error, using mock login');
      // mock login for demo - accepts anything
      var mockUser = {
        id: 1,
        name: 'Admin User',
        email: email,
        role: 'admin',
      };
      var mockToken = 'mock-jwt-token-12345';

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: mockUser,
          token: mockToken,
        },
      });
    });
  };
}

export function logout() {
  return function(dispatch) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };
}

// TODO: implement token refresh
export function checkAuth() {
  return function(dispatch) {
    var token = localStorage.getItem('token');
    var user = localStorage.getItem('user');

    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: JSON.parse(user),
          token: token,
        },
      });
    }
  };
}
