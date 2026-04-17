export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'pending';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  lastLogin: string | null;
};

export type UserFormData = {
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  status: UserStatus;
};

export type UserFormErrors = Partial<Record<'name' | 'email' | 'role', string>>;

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  editor: 'Editor',
  viewer: 'Viewer',
};
