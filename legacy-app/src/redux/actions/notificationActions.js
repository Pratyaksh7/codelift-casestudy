import axios from 'axios'

var mockNotifications = [
  { id: 1, type: 'warning', message: 'Low stock alert: Mechanical Keyboard RGB (3 remaining)', read: false, timestamp: '2022-01-15T10:30:00Z' },
  { id: 2, type: 'info', message: 'New order received: ORD-1024 from John Doe', read: false, timestamp: '2022-01-15T10:15:00Z' },
  { id: 3, type: 'success', message: 'Payment processed for order ORD-1023', read: true, timestamp: '2022-01-15T09:20:00Z' },
  { id: 4, type: 'warning', message: 'Low stock alert: LED Desk Lamp (5 remaining)', read: true, timestamp: '2022-01-14T16:00:00Z' },
  { id: 5, type: 'error', message: 'Failed to sync inventory with warehouse B', read: false, timestamp: '2022-01-14T14:45:00Z' },
  { id: 6, type: 'info', message: 'New user registration: James Brown', read: true, timestamp: '2022-01-14T11:30:00Z' },
  { id: 7, type: 'success', message: 'Weekly report generated successfully', read: true, timestamp: '2022-01-14T08:00:00Z' },
  { id: 8, type: 'info', message: 'Coupon WINTER20 is expiring in 30 days', read: false, timestamp: '2022-01-13T15:00:00Z' },
]

export function fetchNotifications() {
  return function(dispatch) {
    dispatch({ type: 'FETCH_NOTIFICATIONS_REQUEST' })

    axios.get('http://localhost:3001/api/notifications')
      .then(function(response) {
        dispatch({
          type: 'FETCH_NOTIFICATIONS_SUCCESS',
          payload: response.data,
        })
      })
      .catch(function(err) {
        console.log('using mock notifications')
        dispatch({
          type: 'FETCH_NOTIFICATIONS_SUCCESS',
          payload: mockNotifications,
        })
      })
  }
}

export function markNotificationRead(notifId) {
  return function(dispatch) {
    dispatch({
      type: 'MARK_NOTIFICATION_READ',
      payload: notifId,
    })

    // sync with server
    axios.patch('http://localhost:3001/api/notifications/' + notifId, { read: true })
      .catch(function(err) {
        console.log('failed to mark notification as read on server')
      })
  }
}

export function markAllNotificationsRead() {
  return function(dispatch) {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' })

    axios.post('http://localhost:3001/api/notifications/mark-all-read')
      .catch(function(err) {
        console.log('failed to mark all notifications read on server')
      })
  }
}

export function dismissNotification(notifId) {
  return function(dispatch) {
    dispatch({
      type: 'DISMISS_NOTIFICATION',
      payload: notifId,
    })
  }
}

export function addNotification(notification) {
  return {
    type: 'ADD_NOTIFICATION',
    payload: Object.assign({
      id: Date.now(),
      read: false,
      timestamp: new Date().toISOString(),
    }, notification),
  }
}
