// Native replacement for `moment(date).fromNow()`
export function formatRelative(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.round((now.getTime() - date.getTime()) / 1000);

  const abs = Math.abs(diffSec);
  const future = diffSec < 0;
  const fmt = (n: number, unit: string): string => {
    const plural = n === 1 ? '' : 's';
    return future ? `in ${n} ${unit}${plural}` : `${n} ${unit}${plural} ago`;
  };

  if (abs < 45) return future ? 'in a few seconds' : 'a few seconds ago';
  if (abs < 90) return future ? 'in a minute' : 'a minute ago';
  if (abs < 45 * 60) return fmt(Math.round(abs / 60), 'minute');
  if (abs < 90 * 60) return future ? 'in an hour' : 'an hour ago';
  if (abs < 22 * 3600) return fmt(Math.round(abs / 3600), 'hour');
  if (abs < 36 * 3600) return future ? 'in a day' : 'a day ago';
  if (abs < 26 * 86400) return fmt(Math.round(abs / 86400), 'day');
  if (abs < 45 * 86400) return future ? 'in a month' : 'a month ago';
  if (abs < 320 * 86400) return fmt(Math.round(abs / (86400 * 30)), 'month');
  if (abs < 548 * 86400) return future ? 'in a year' : 'a year ago';
  return fmt(Math.round(abs / (86400 * 365)), 'year');
}
