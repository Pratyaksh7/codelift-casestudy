// Lightweight date utilities (replaces legacy moment-based helpers)

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return 'N/A';
  const mm = MONTHS_SHORT[d.getMonth()];
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm} ${dd}, ${yyyy}`;
}

export function getRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  const diffMs = Date.now() - d.getTime();
  const past = diffMs >= 0;
  const abs = Math.abs(diffMs);

  const sec = Math.round(abs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  const month = Math.round(day / 30);
  const year = Math.round(day / 365);

  let value: string;
  if (sec < 45) value = 'a few seconds';
  else if (min < 2) value = 'a minute';
  else if (min < 45) value = `${min} minutes`;
  else if (hr < 2) value = 'an hour';
  else if (hr < 22) value = `${hr} hours`;
  else if (day < 2) value = 'a day';
  else if (day < 26) value = `${day} days`;
  else if (month < 2) value = 'a month';
  else if (month < 11) value = `${month} months`;
  else if (year < 2) value = 'a year';
  else value = `${year} years`;

  return past ? `${value} ago` : `in ${value}`;
}
