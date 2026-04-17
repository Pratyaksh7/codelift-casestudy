import axios from 'axios';
import moment from 'moment';

// mock analytics data
var mockSalesData = {
  daily: [
    { date: '2022-01-09', revenue: 2340, orders: 12 },
    { date: '2022-01-10', revenue: 3120, orders: 18 },
    { date: '2022-01-11', revenue: 2890, orders: 15 },
    { date: '2022-01-12', revenue: 4560, orders: 24 },
    { date: '2022-01-13', revenue: 3780, orders: 20 },
    { date: '2022-01-14', revenue: 5210, orders: 28 },
    { date: '2022-01-15', revenue: 4890, orders: 26 },
  ],
  monthly: [
    { month: 'Jan', revenue: 45600, orders: 234 },
    { month: 'Feb', revenue: 52300, orders: 267 },
    { month: 'Mar', revenue: 48900, orders: 251 },
    { month: 'Apr', revenue: 61200, orders: 312 },
    { month: 'May', revenue: 55800, orders: 289 },
    { month: 'Jun', revenue: 67400, orders: 345 },
    { month: 'Jul', revenue: 72100, orders: 368 },
    { month: 'Aug', revenue: 64300, orders: 330 },
    { month: 'Sep', revenue: 58900, orders: 301 },
    { month: 'Oct', revenue: 71200, orders: 364 },
    { month: 'Nov', revenue: 89400, orders: 456 },
    { month: 'Dec', revenue: 95600, orders: 489 },
  ],
  topProducts: [
    { name: 'Wireless Bluetooth Headphones', sales: 156, revenue: 12480 },
    { name: 'Mechanical Keyboard RGB', sales: 98, revenue: 14700 },
    { name: 'Running Shoes Pro', sales: 87, revenue: 11310 },
    { name: 'LED Desk Lamp', sales: 134, revenue: 5356 },
    { name: 'Cotton T-Shirt Pack (3)', sales: 201, revenue: 6030 },
  ],
  topCategories: [
    { name: 'Electronics', percentage: 35 },
    { name: 'Clothing', percentage: 22 },
    { name: 'Sports', percentage: 18 },
    { name: 'Home & Garden', percentage: 15 },
    { name: 'Books', percentage: 10 },
  ],
  visitors: {
    total: 45230,
    unique: 28900,
    bounceRate: 42.5,
    avgSessionDuration: 245, // seconds
  },
};

export function fetchAnalyticsData(dateRange) {
  return function(dispatch) {
    dispatch({ type: 'FETCH_ANALYTICS_REQUEST' });

    var params = {};
    if (dateRange) {
      params.start = dateRange.start;
      params.end = dateRange.end;
    }

    console.log('[Analytics] Fetching data for range:', dateRange);

    axios.get('http://localhost:3001/api/analytics', { params: params })
      .then(function(response) {
        console.log('[Analytics] Data received:', response.data);
        dispatch({
          type: 'FETCH_ANALYTICS_SUCCESS',
          payload: response.data,
        });
      })
      .catch(function(error) {
        console.log('[Analytics] Using mock data');
        dispatch({
          type: 'FETCH_ANALYTICS_SUCCESS',
          payload: mockSalesData,
        });
      });
  };
}

export function fetchSalesReport(startDate, endDate) {
  return function(dispatch) {
    dispatch({ type: 'FETCH_SALES_REPORT_REQUEST' });

    var url = 'http://localhost:3001/api/analytics/sales-report';
    url += '?start=' + moment(startDate).format('YYYY-MM-DD');
    url += '&end=' + moment(endDate).format('YYYY-MM-DD');

    axios.get(url)
      .then(function(res) {
        dispatch({
          type: 'FETCH_SALES_REPORT_SUCCESS',
          payload: res.data,
        });
      })
      .catch(function(err) {
        console.log('[Analytics] Sales report mock data');
        // generate mock data based on date range
        var days = moment(endDate).diff(moment(startDate), 'days');
        var reportData = [];
        for (var i = 0; i < days; i++) {
          reportData.push({
            date: moment(startDate).add(i, 'days').format('YYYY-MM-DD'),
            revenue: Math.floor(Math.random() * 5000) + 1000,
            orders: Math.floor(Math.random() * 30) + 5,
            avgOrderValue: Math.floor(Math.random() * 100) + 50,
          });
        }
        dispatch({
          type: 'FETCH_SALES_REPORT_SUCCESS',
          payload: reportData,
        });
      });
  };
}

export function setAnalyticsDateRange(range) {
  return {
    type: 'SET_ANALYTICS_DATE_RANGE',
    payload: range,
  };
}
