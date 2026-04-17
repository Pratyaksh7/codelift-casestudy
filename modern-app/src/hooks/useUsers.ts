import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import {
  createUser as createUserRequest,
  deleteUser as deleteUserRequest,
  fetchUsers,
  updateUser as updateUserRequest,
} from '../api/services/users';
import { MOCK_USERS } from '../pages/Users/mockUsers';
import type { User, UserFormData } from '../pages/Users/types';

function messageFrom(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export type UseUsersResult = {
  users: User[];
  loading: boolean;
  error: string | null;
  createUser: (payload: UserFormData) => Promise<User>;
  updateUser: (id: string, payload: UserFormData) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
};

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const list = await fetchUsers(controller.signal);
        if (!cancelled) {
          setUsers(list);
          setError(null);
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        // Legacy userActions.fetchUsers falls back to mock data on axios error.
        setUsers(MOCK_USERS);
        setError(messageFrom(err, 'Failed to load users'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const createUser = useCallback(async (payload: UserFormData) => {
    try {
      const created = await createUserRequest(payload);
      setUsers((prev) => [...prev, created]);
      setError(null);
      return created;
    } catch (err) {
      setError(messageFrom(err, 'Failed to create user'));
      throw err;
    }
  }, []);

  const updateUser = useCallback(
    async (id: string, payload: UserFormData) => {
      try {
        const updated = await updateUserRequest(id, payload);
        setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        setError(null);
        return updated;
      } catch (err) {
        setError(messageFrom(err, 'Failed to update user'));
        throw err;
      }
    },
    [],
  );

  const deleteUser = useCallback(async (id: string) => {
    try {
      await deleteUserRequest(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setError(null);
    } catch (err) {
      setError(messageFrom(err, 'Failed to delete user'));
      throw err;
    }
  }, []);

  return { users, loading, error, createUser, updateUser, deleteUser };
}

export default useUsers;
