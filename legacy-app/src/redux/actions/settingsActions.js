import axios from 'axios';

var mockSettings = {
  profile: {
    companyName: 'EcomDash Store',
    email: 'admin@ecomdash.com',
    phone: '555-0100',
    address: '123 Commerce St, Business City, BC 12345',
    website: 'https://ecomdash.example.com',
    timezone: 'America/New_York',
    currency: 'USD',
    logo: null,
  },
  notifications: {
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    weeklyReport: true,
    marketingEmails: false,
    securityAlerts: true,
    newUserAlerts: false,
    systemUpdates: true,
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: 30, // minutes
    passwordExpiry: 90, // days
    ipWhitelist: '',
    lastPasswordChange: '2021-12-01T00:00:00Z',
  },
};

export function fetchSettings() {
  return function(dispatch) {
    dispatch({ type: 'FETCH_SETTINGS_REQUEST' });

    axios.get('http://localhost:3001/api/settings')
      .then(function(response) {
        console.log('settings loaded', response.data)
        dispatch({
          type: 'FETCH_SETTINGS_SUCCESS',
          payload: response.data,
        });
      })
      .catch(function(error) {
        console.log('using mock settings');
        dispatch({
          type: 'FETCH_SETTINGS_SUCCESS',
          payload: mockSettings,
        });
      });
  };
}

export function updateProfileSettings(profileData) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_SETTINGS_REQUEST' });

    axios.put('http://localhost:3001/api/settings/profile', profileData)
      .then(function(res) {
        console.log('profile settings saved');
        dispatch({
          type: 'UPDATE_PROFILE_SETTINGS_SUCCESS',
          payload: res.data,
        });
      })
      .catch(function(err) {
        console.log('settings save failed, updating locally');
        dispatch({
          type: 'UPDATE_PROFILE_SETTINGS_SUCCESS',
          payload: profileData,
        });
      });
  };
}

export function updateNotificationSettings(notifData) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_SETTINGS_REQUEST' });

    axios.put('http://localhost:3001/api/settings/notifications', notifData)
      .then(function(res) {
        dispatch({
          type: 'UPDATE_NOTIFICATION_SETTINGS_SUCCESS',
          payload: res.data,
        });
      })
      .catch(function(err) {
        console.log('notification settings save failed');
        dispatch({
          type: 'UPDATE_NOTIFICATION_SETTINGS_SUCCESS',
          payload: notifData,
        });
      });
  };
}

export function updateSecuritySettings(secData) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_SETTINGS_REQUEST' })

    axios.put('http://localhost:3001/api/settings/security', secData)
      .then(function(res) {
        dispatch({
          type: 'UPDATE_SECURITY_SETTINGS_SUCCESS',
          payload: res.data
        })
      })
      .catch(function(err) {
        console.log('security settings save failed');
        dispatch({
          type: 'UPDATE_SECURITY_SETTINGS_SUCCESS',
          payload: secData,
        })
      })
  }
}
