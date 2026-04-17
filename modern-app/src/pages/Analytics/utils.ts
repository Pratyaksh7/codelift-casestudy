const THOUSAND = 1_000;
const MILLION = 1_000_000;

export function formatCurrency(amount: number): string {
  return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export function formatCompactNumber(num: number): string {
  if (num >= MILLION) return (num / MILLION).toFixed(1) + 'M';
  if (num >= THOUSAND) return (num / THOUSAND).toFixed(1) + 'K';
  return num.toString();
}

/** Converts an ISO date string (YYYY-MM-DD) to an MM/DD label. */
export function formatDateMMDD(iso: string): string {
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  return `${parts[1]}/${parts[2]}`;
}

export function formatSessionDuration(totalSeconds: number): {
  minutes: number;
  seconds: number;
} {
  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
  };
}
