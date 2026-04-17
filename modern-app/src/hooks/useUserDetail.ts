import { useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import {
  fetchUserActivity,
  fetchUserById,
  type ActivityEntry,
  type ActivityType,
  type UserDetailRecord,
} from '../api/services/users';

export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'inactive' | 'pending';
export type { ActivityEntry, ActivityType };
export type User = UserDetailRecord;

// Legacy userActions falls back to mockUsers / mockActivityLog on axios failure —
// preserved so the page still renders instead of going to the 'not found' state.
const MOCK_USER: User = {
  id: 42,
  name: 'Alexandra Chen',
  email: 'alex.chen@example.com',
  phone: '+1 (415) 555-0142',
  role: 'manager',
  status: 'active',
  joinDate: '2023-03-14T09:22:00.000Z',
  lastLogin: '2026-04-12T18:47:00.000Z',
};

const MOCK_ACTIVITY: ActivityEntry[] = [
  { id: 1, type: 'order', action: 'Processed order #10241 for $428.90', timestamp: '2026-04-13T08:12:00.000Z' },
  { id: 2, type: 'product', action: 'Updated product "Wireless Headphones XL"', timestamp: '2026-04-12T16:03:00.000Z' },
  { id: 3, type: 'coupon', action: 'Created coupon SPRING25 (25% off)', timestamp: '2026-04-11T13:48:00.000Z' },
  { id: 4, type: 'auth', action: 'Signed in from new device', timestamp: '2026-04-10T09:01:00.000Z' },
  { id: 5, type: 'settings', action: 'Updated notification preferences', timestamp: '2026-04-08T11:20:00.000Z' },
];

function messageFrom(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export type UseUserDetailResult = {
  user: User | null;
  activityLog: ActivityEntry[];
  loading: boolean;
  error: string | null;
};

export function useUserDetail(userId: string | undefined): UseUserDetailResult {
  const [user, setUser] = useState<User | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setActivityLog([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    (async () => {
      try {
        const [fetchedUser, fetchedActivity] = await Promise.all([
          fetchUserById(userId, controller.signal),
          fetchUserActivity(userId, controller.signal),
        ]);
        if (!cancelled) {
          setUser(fetchedUser);
          setActivityLog(fetchedActivity);
          setError(null);
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        setUser(MOCK_USER);
        setActivityLog(MOCK_ACTIVITY);
        setError(messageFrom(err, 'Failed to load user details'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [userId]);

  return { user, activityLog, loading, error };
}

export default useUserDetail;
