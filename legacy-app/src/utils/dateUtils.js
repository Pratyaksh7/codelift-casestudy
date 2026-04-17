// Date utility functions wrapping Moment.js
// TODO: migrate to date-fns or dayjs eventually

import moment from 'moment';

/**
 * Format a date string to display format
 */
export function formatDate(date, format) {
  if (!format) format = 'MMM DD, YYYY';
  if (!date) return 'N/A';
  return moment(date).format(format);
}

/**
 * Format date with time
 */
export function formatDateTime(date) {
  if (!date) return 'N/A';
  return moment(date).format('MMM DD, YYYY h:mm A');
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date) {
  if (!date) return '';
  return moment(date).fromNow();
}

/**
 * Check if a date is today
 */
export function isToday(date) {
  return moment(date).isSame(moment(), 'day');
}

/**
 * Check if a date is in the past
 */
export function isPast(date) {
  return moment(date).isBefore(moment());
}

/**
 * Check if a date is in the future
 */
export function isFuture(date) {
  return moment(date).isAfter(moment());
}

/**
 * Get start of day
 */
export function startOfDay(date) {
  return moment(date).startOf('day').toISOString();
}

/**
 * Get end of day
 */
export function endOfDay(date) {
  return moment(date).endOf('day').toISOString();
}

/**
 * Get date range for predefined periods
 */
export function getDateRange(period) {
  var now = moment();
  var start, end;

  switch(period) {
    case 'today':
      start = moment().startOf('day');
      end = moment().endOf('day');
      break;
    case 'yesterday':
      start = moment().subtract(1, 'days').startOf('day');
      end = moment().subtract(1, 'days').endOf('day');
      break;
    case 'last7days':
      start = moment().subtract(7, 'days').startOf('day');
      end = moment().endOf('day');
      break;
    case 'last30days':
      start = moment().subtract(30, 'days').startOf('day');
      end = moment().endOf('day');
      break;
    case 'thisMonth':
      start = moment().startOf('month');
      end = moment().endOf('month');
      break;
    case 'lastMonth':
      start = moment().subtract(1, 'month').startOf('month');
      end = moment().subtract(1, 'month').endOf('month');
      break;
    case 'thisYear':
      start = moment().startOf('year');
      end = moment().endOf('year');
      break;
    default:
      start = moment().subtract(30, 'days').startOf('day');
      end = moment().endOf('day');
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
    startFormatted: start.format('YYYY-MM-DD'),
    endFormatted: end.format('YYYY-MM-DD'),
  };
}

/**
 * Calculate difference between two dates
 */
export function dateDiff(date1, date2, unit) {
  if (!unit) unit = 'days';
  return moment(date1).diff(moment(date2), unit);
}

/**
 * Format duration in milliseconds to human readable
 */
export function formatDuration(ms) {
  var duration = moment.duration(ms);
  if (duration.asDays() >= 1) {
    return Math.floor(duration.asDays()) + 'd ' + duration.hours() + 'h';
  }
  if (duration.asHours() >= 1) {
    return duration.hours() + 'h ' + duration.minutes() + 'm';
  }
  return duration.minutes() + 'm ' + duration.seconds() + 's';
}

// get array of last N days for chart labels
export function getLastNDays(n) {
  var days = [];
  for (var i = n - 1; i >= 0; i--) {
    days.push(moment().subtract(i, 'days').format('MMM DD'));
  }
  return days;
}

// get array of months for current year
export function getMonthLabels() {
  var months = [];
  for (var i = 0; i < 12; i++) {
    months.push(moment().month(i).format('MMM'));
  }
  return months;
}
