import axios from 'axios';

var mockOrders = [
  { id: 'ORD-1024', customer: 'John Doe', email: 'john@example.com', items: 3, total: 299.99, status: 'completed', date: '2022-01-15T10:30:00Z' },
  { id: 'ORD-1023', customer: 'Jane Smith', email: 'jane@example.com', items: 1, total: 149.50, status: 'processing', date: '2022-01-15T09:15:00Z' },
  { id: 'ORD-1022', customer: 'Bob Johnson', email: 'bob@example.com', items: 2, total: 89.99, status: 'shipped', date: '2022-01-14T16:45:00Z' },
  { id: 'ORD-1021', customer: 'Alice Brown', email: 'alice@example.com', items: 5, total: 450.00, status: 'completed', date: '2022-01-14T14:20:00Z' },
  { id: 'ORD-1020', customer: 'Charlie Wilson', email: 'charlie@example.com', items: 1, total: 67.25, status: 'pending', date: '2022-01-14T11:00:00Z' },
  { id: 'ORD-1019', customer: 'Diana Prince', email: 'diana@example.com', items: 4, total: 234.00, status: 'completed', date: '2022-01-13T15:30:00Z' },
  { id: 'ORD-1018', customer: 'Edward Norton', email: 'edward@example.com', items: 2, total: 178.50, status: 'shipped', date: '2022-01-13T10:00:00Z' },
  { id: 'ORD-1017', customer: 'Fiona Green', email: 'fiona@example.com', items: 1, total: 45.00, status: 'cancelled', date: '2022-01-12T14:00:00Z' },
  { id: 'ORD-1016', customer: 'George Harris', email: 'george@example.com', items: 3, total: 312.75, status: 'processing', date: '2022-01-12T09:45:00Z' },
  { id: 'ORD-1015', customer: 'Helen Troy', email: 'helen@example.com', items: 2, total: 99.98, status: 'pending', date: '2022-01-11T17:20:00Z' },
];

export function fetchOrders() {
  return function(dispatch) {
    dispatch({ type: 'FETCH_ORDERS_REQUEST' });

    // TODO: abstract the api url somewhere
    axios.get('http://localhost:3001/api/orders')
      .then(function(response) {
        dispatch({
          type: 'FETCH_ORDERS_SUCCESS',
          payload: response.data,
        });
      })
      .catch(function(err) {
        console.log('orders api error, using mock data');
        dispatch({
          type: 'FETCH_ORDERS_SUCCESS',
          payload: mockOrders,
        });
      });
  };
}

export function updateOrderStatus(orderId, status) {
  return function(dispatch) {
    // optimistic update
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId: orderId, status: status },
    });

    // then sync with server
    axios.patch('http://localhost:3001/api/orders/' + orderId, { status: status })
      .then(function(res) {
        console.log('order status updated on server');
      })
      .catch(function(err) {
        console.log('failed to update on server, but local state updated');
        // TODO: should we revert the optimistic update here?
      });
  };
}
