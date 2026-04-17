import type { User, UserFormData } from '../../pages/Users/types';
import { client } from '../client';
import { endpoints } from '../endpoints';

export type UserRoleDetail = 'admin' | 'manager' | 'editor' | 'viewer';
export type UserStatusDetail = 'active' | 'inactive' | 'pending';

export type UserDetailRecord = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRoleDetail;
  status: UserStatusDetail;
  joinDate: string;
  lastLogin: string | null;
};

export type ActivityType =
  | 'product'
  | 'order'
  | 'settings'
  | 'coupon'
  | 'auth';

export type ActivityEntry = {
  id: number;
  type: ActivityType;
  action: string;
  timestamp: string;
};

export function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  return client.get<User[]>(endpoints.users.list, { signal });
}

export function createUser(payload: UserFormData): Promise<User> {
  return client.post<User>(endpoints.users.list, payload);
}

export function updateUser(id: string, payload: UserFormData): Promise<User> {
  return client.put<User>(endpoints.users.byId(id), payload);
}

export function deleteUser(id: string): Promise<void> {
  return client.del<void>(endpoints.users.byId(id));
}

export function fetchUserById(
  id: string,
  signal?: AbortSignal,
): Promise<UserDetailRecord> {
  return client.get<UserDetailRecord>(endpoints.users.byId(id), { signal });
}

export function fetchUserActivity(
  id: string,
  signal?: AbortSignal,
): Promise<ActivityEntry[]> {
  return client.get<ActivityEntry[]>(endpoints.users.activityById(id), { signal });
}
