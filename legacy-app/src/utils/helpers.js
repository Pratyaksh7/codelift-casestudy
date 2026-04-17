// helpers.js - utility functions used across the app
// TODO: some of these should probably be in separate files

var moment = require('moment');

/**
 * Format a number as currency
 * @param {number} amount
 * @param {string} currency
 */
export function formatCurrency(amount, currency) {
  if (currency === undefined) currency = 'USD';

  // TODO: use Intl.NumberFormat instead?
  if (currency === 'USD') {
    return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  } else if (currency === 'EUR') {
    return '€' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
  return amount.toFixed(2);
}

/**
 * Truncate text to a certain length
 */
export function truncateText(text, maxLength) {
  if (!text) return '';
  if (maxLength === undefined) maxLength = 50;

  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Generate a unique-ish ID
 * NOTE: not truly unique, don't use for anything critical
 */
export function generateId() {
  var timestamp = new Date().getTime();
  var random = Math.random().toString(36).substring(2, 9);
  return timestamp + '-' + random;
}

/**
 * Deep clone an object using JSON parse/stringify
 * WARNING: doesn't work with functions, dates, etc
 */
export function deepClone(obj) {
  // this is the lazy way but it works for simple objects
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch(e) {
    console.log('deepClone failed:', e);
    return obj;
  }
}

/**
 * Debounce function - delays execution
 */
export function debounce(func, wait) {
  var timeout;
  return function() {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Throttle function
 */
export function throttle(func, limit) {
  var inThrottle;
  return function() {
    var args = arguments;
    var context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(function() {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Get initials from a name string
 */
export function getInitials(name) {
  if (!name) return '??';
  var parts = name.split(' ');
  if (parts.length >= 2) {
    return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

/**
 * Capitalize first letter
 */
export const capitalizeFirst = function(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format large numbers with K, M suffixes
 */
export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Simple object comparison (shallow)
 */
export function shallowEqual(obj1, obj2) {
  var keys1 = Object.keys(obj1);
  var keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (var i = 0; i < keys1.length; i++) {
    if (obj1[keys1[i]] !== obj2[keys1[i]]) return false;
  }
  return true;
}

/**
 * Get a random color - used for avatar backgrounds
 */
export function getRandomColor() {
  var colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Parse query string params from URL
 * TODO: use URLSearchParams instead
 */
export function parseQueryString(queryString) {
  var params = {};
  if (!queryString) return params;

  var str = queryString.replace('?', '');
  var pairs = str.split('&');

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }

  return params;
}

/**
 * Download data as CSV file
 */
export function downloadCSV(data, filename) {
  if (!filename) filename = 'export.csv';

  var csvContent = '';

  // headers
  if (data.length > 0) {
    csvContent += Object.keys(data[0]).join(',') + '\n';
  }

  // rows
  data.forEach(function(row) {
    var values = Object.values(row).map(function(val) {
      return '"' + String(val).replace(/"/g, '""') + '"';
    });
    csvContent += values.join(',') + '\n';
  });

  var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  var link = document.createElement('a');
  var url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// sleep function - useful for simulating delays
export function sleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}
