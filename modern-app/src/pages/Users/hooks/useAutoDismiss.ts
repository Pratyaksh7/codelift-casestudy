import { useEffect } from 'react';

/**
 * When `value` is truthy, schedules `onDismiss` after `delayMs`.
 * Used by the Users page to auto-hide the toast message.
 */
export function useAutoDismiss<T>(
  value: T | null,
  delayMs: number,
  onDismiss: () => void,
): void {
  useEffect(() => {
    if (!value) return;
    const id = window.setTimeout(onDismiss, delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs, onDismiss]);
}
