import { useEffect, useState } from 'react';

/**
 * Flips to `true` after `delayMs`. Used to replicate the legacy
 * jQuery fade-in on the Users page header.
 */
export function useDelayedFlag(delayMs: number): boolean {
  const [flag, setFlag] = useState<boolean>(false);

  useEffect(() => {
    const id = window.setTimeout(() => setFlag(true), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs]);

  return flag;
}
