// API utility - axios instance configuration
// TODO: this whole thing needs refactoring

import axios from 'axios';

// create axios instance
var api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  function(config) {
    console.log('[API Request]', config.method.toUpperCase(), config.url);

    var token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }

    // log the request body for debugging
    if (config.data) {
      console.log('[API Request Body]', config.data);
    }

    return config;
  },
  function(error) {
    console.log('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  function(response) {
    console.log('[API Response]', response.status, response.config.url);
    console.log('[API Response Data]', response.data);
    return response;
  },
  function(error) {
    console.log('[API Error]', error.response ? error.response.status : 'Network Error');
    console.log('[API Error Details]', error.message);

    if (error.response) {
      // handle 401 - unauthorized
      if (error.response.status === 401) {
        console.log('Unauthorized! Clearing token...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // TODO: redirect to login page
        // window.location.href = '/login';
      }

      // handle 403 - forbidden
      if (error.response.status === 403) {
        console.log('Forbidden! User does not have permission.');
      }

      // handle 500 - server error
      if (error.response.status === 500) {
        console.log('Server error! Something went wrong.');
        // TODO: show a toast notification
      }
    }

    return Promise.reject(error);
  }
);

// convenience methods that wrap axios
// TODO: these are redundant since axios already has these methods

export function get(url, params) {
  return api.get(url, { params: params });
}

export function post(url, data) {
  return api.post(url, data);
}

export function put(url, data) {
  return api.put(url, data);
}

export function patch(url, data) {
  return api.patch(url, data);
}

// using 'del' because 'delete' is a reserved word
export function del(url) {
  return api.delete(url);
}

// upload file with progress callback
export function uploadFile(url, file, onProgress) {
  var formData = new FormData();
  formData.append('file', file);

  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: function(progressEvent) {
      if (onProgress) {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log('Upload progress: ' + percentCompleted + '%');
        onProgress(percentCompleted);
      }
    },
  });
}

export default api;
